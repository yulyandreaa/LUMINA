import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { readOverrides, variantKey, writeOverrides } from '../../admin/catalogOverrides';
import { readCustomProducts, slugify, writeCustomProducts } from '../../admin/customProducts';
import { baseProducts, colorPalette } from '../../data/products';
import { sizeGuide } from '../../data/sizes';
import { shapeLabels } from '../../lib/catalog';
import { compressPhoto } from '../../lib/compressPhoto';
import { formatPrice } from '../../lib/format';
import type { Audience, Category, ColorVariant, FrameShape, FrameSize, Product } from '../../types/product';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { controlClass } from '../../components/ui/fieldStyles';
import { AdminHead } from './AdminLayout';
import styles from './Admin.module.css';

/*
 * Subir producto (página propia del panel), en dos columnas:
 * - principal: información, colores con su foto (cada color necesita foto: la tienda muestra la montura en ese color)
 *   y cantidad de unidades por color y talla (se guarda como inventario, igual que en el editor);
 * - lateral: precio, tallas, publicación y el botón para subirlo.
 * Al terminar vuelve a Productos con el producto abierto.
 */
const categories: Record<Category, string> = { monturas: 'Monturas', 'gafas-de-sol': 'Gafas de sol' };
const audiences: Record<Audience, string> = { unisex: 'Unisex', mujer: 'Mujer', hombre: 'Hombre' };
const allSizes = Object.keys(sizeGuide) as FrameSize[];
const palette = Object.values(colorPalette) as ColorVariant[];
const OTHER = 'otro';

interface ColorDraft {
  key: number;
  /** id de un color del catálogo, u OTHER para escribir uno nuevo. */
  preset: string;
  name: string;
  hex: string;
  image?: string;
  loading?: boolean;
}

let nextKey = 1;
const newColor = (): ColorDraft => ({ key: nextKey++, preset: palette[0].id, name: palette[0].name, hex: palette[0].hex });

type Errors = Partial<Record<'name' | 'sizes' | 'price' | 'description' | 'colors' | 'stock' | 'form', string>>;

/** Clave de la cantidad mientras se edita: el id del color aún puede cambiar con su nombre. */
const draftKey = (colorKey: number, size: FrameSize) => `${colorKey}:${size}`;

export function AdminNewProductPage() {
  usePageTitle('Subir producto · Administración');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('monturas');
  const [shape, setShape] = useState<FrameShape>('redonda');
  const [audience, setAudience] = useState<Audience>('unisex');
  const [sizes, setSizes] = useState<FrameSize[]>(['media']);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<ColorDraft[]>(() => [newColor()]);
  const [isNew, setIsNew] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [visible, setVisible] = useState(true);
  const [stock, setStock] = useState<Record<string, string>>({});
  const [fillAll, setFillAll] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const unitsOf = (colorKey: number, size: FrameSize) => stock[draftKey(colorKey, size)] ?? '';
  const totalUnits = colors.reduce((n, c) => n + sizes.reduce((m, s) => m + (Number(unitsOf(c.key, s)) || 0), 0), 0);

  const applyToAll = () => {
    if (fillAll === '') return;
    setStock(Object.fromEntries(colors.flatMap((c) => sizes.map((s) => [draftKey(c.key, s), fillAll]))));
  };

  const updateColor = (key: number, patch: Partial<ColorDraft>) =>
    setColors((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));

  const choosePreset = (key: number, preset: string) => {
    const p = palette.find((c) => c.id === preset);
    updateColor(key, p ? { preset, name: p.name, hex: p.hex } : { preset: OTHER, name: '', hex: '#861f26' });
  };

  const uploadPhoto = async (key: number, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/'))
      return setErrors((e) => ({ ...e, colors: 'El archivo debe ser una imagen (JPG, PNG o WebP).' }));
    updateColor(key, { loading: true });
    try {
      updateColor(key, { image: await compressPhoto(file), loading: false });
    } catch {
      updateColor(key, { loading: false });
      setErrors((e) => ({ ...e, colors: 'No se pudo leer esa imagen. Prueba con otra en JPG o PNG.' }));
    }
  };

  const toggleSize = (s: FrameSize) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : allSizes.filter((x) => x === s || prev.includes(x))));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const custom = readCustomProducts();
    const slug = slugify(name);
    const amount = Number(price);
    const colorIds = colors.map((c) => slugify(c.name));
    const next: Errors = {};

    if (!name.trim()) next.name = 'Escribe el nombre del producto.';
    else if (!slug) next.name = 'El nombre debe tener letras o números.';
    else if ([...baseProducts, ...custom].some((p) => p.slug === slug)) next.name = 'Ya existe un producto con ese nombre.';
    if (sizes.length === 0) next.sizes = 'Elige al menos una talla.';
    if (!Number.isInteger(amount) || amount < 1000) next.price = 'Escribe el precio en pesos, sin puntos ni decimales.';
    if (!description.trim()) next.description = 'Escribe una descripción corta.';
    if (colors.length === 0) next.colors = 'Añade al menos un color.';
    else if (colors.some((c) => !c.name.trim())) next.colors = 'Escribe el nombre de cada color.';
    else if (new Set(colorIds).size !== colorIds.length) next.colors = 'Hay dos colores con el mismo nombre.';
    else if (colors.some((c) => c.loading)) next.colors = 'Espera a que terminen de cargar las fotos.';
    else if (colors.some((c) => !c.image)) next.colors = 'Cada color necesita su foto.';

    const missing = colors.some((c) => sizes.some((s) => unitsOf(c.key, s) === ''));
    if (missing) next.stock = 'Escribe la cantidad de cada color y talla (0 si no tienes unidades).';

    setErrors(next);
    if (Object.keys(next).length) return;

    const product: Product = {
      id: `c-${slug}`,
      slug,
      name: name.trim().toUpperCase(),
      category,
      shape,
      sizes,
      colors: colors.map((c, i) => ({ id: colorIds[i], name: c.name.trim(), hex: c.hex, image: c.image })),
      price: amount,
      description: description.trim(),
      audience,
      releasedAt: new Date().toISOString().slice(0, 10),
      ...(isNew && { isNew: true }),
      ...(bestSeller && { bestSeller: true }),
      ...(!visible && { hidden: true }),
      fictional: false,
    };
    if (!writeCustomProducts([...custom, product]))
      return setErrors({
        form: 'El navegador no tiene espacio para guardar más fotos. Usa fotos más livianas o elimina un producto subido.',
      });
    // Las unidades van al inventario del panel (las compras descuentan de ahí).
    const overrides = readOverrides();
    overrides[product.id] = {
      stock: Object.fromEntries(
        colors.flatMap((c, i) => sizes.map((s) => [variantKey(colorIds[i], s), Number(unitsOf(c.key, s))])),
      ),
    };
    writeOverrides(overrides);
    navigate(`/admin/productos?nuevo=${product.id}`);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <>
      <AdminHead title="Subir producto">
        <Link to="/admin/productos" className={styles.textButton}>
          ← Volver a productos
        </Link>
      </AdminHead>

      <form className={styles.productForm} onSubmit={submit} noValidate>
        <div className={styles.formMain}>
          <section className={styles.panel} aria-labelledby="np-info">
            <h2 id="np-info" className={styles.panelTitle}>
              Información
            </h2>
            <Field id="np-name" label="Nombre" error={errors.name} hint="Se muestra en mayúsculas, como el resto del catálogo.">
              {(a11y) => (
                <input
                  {...a11y}
                  className={controlClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="Ej.: ÁMBAR"
                />
              )}
            </Field>
            <div className={styles.fieldRow}>
              <Field id="np-category" label="Categoría">
                {(a11y) => (
                  <select
                    {...a11y}
                    className={controlClass}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {Object.entries(categories).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field id="np-shape" label="Forma">
                {(a11y) => (
                  <select {...a11y} className={controlClass} value={shape} onChange={(e) => setShape(e.target.value as FrameShape)}>
                    {Object.entries(shapeLabels).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field id="np-audience" label="Para">
                {(a11y) => (
                  <select
                    {...a11y}
                    className={controlClass}
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as Audience)}
                  >
                    {Object.entries(audiences).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            <Field id="np-description" label="Descripción" error={errors.description} hint={`${description.length} de 240 caracteres`}>
              {(a11y) => (
                <textarea
                  {...a11y}
                  className={`${controlClass} ${styles.textarea}`}
                  rows={3}
                  maxLength={240}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Una o dos frases sobre la montura: forma, material, detalle que la distingue."
                />
              )}
            </Field>
          </section>

          <section className={styles.panel} aria-labelledby="np-colors">
            <div className={styles.panelHead}>
              <h2 id="np-colors" className={styles.panelTitle}>
                Colores y fotos
              </h2>
              <span className={styles.muted}>
                {colors.length} color{colors.length === 1 ? '' : 'es'}
              </span>
            </div>
            <p className={styles.muted}>Una foto por color, cuadrada y con fondo claro, como las del catálogo.</p>
            <ul className={styles.colorGrid}>
              {colors.map((c, i) => (
                <li key={c.key} className={styles.colorTile}>
                  <label className={styles.uploadBox} data-filled={!!c.image}>
                    {c.image ? (
                      <>
                        <img src={c.image} alt={`Foto en ${c.name || 'este color'}`} />
                        <span className={styles.uploadChange}>Cambiar foto</span>
                      </>
                    ) : (
                      <span className={styles.uploadEmpty}>
                        <span className={styles.uploadPlus} aria-hidden="true">
                          +
                        </span>
                        {c.loading ? 'Cargando…' : 'Subir foto'}
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      aria-label={`Foto del color ${i + 1}`}
                      onChange={(e) => uploadPhoto(c.key, e.target.files?.[0])}
                    />
                  </label>
                  <div className={styles.colorFields}>
                    <div className={styles.colorSelect}>
                      <span className={styles.swatchLg} style={{ background: c.hex }} aria-hidden="true" />
                      <select
                        className={controlClass}
                        value={c.preset}
                        onChange={(e) => choosePreset(c.key, e.target.value)}
                        aria-label={`Color ${i + 1}`}
                      >
                        {palette.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                        <option value={OTHER}>Otro color…</option>
                      </select>
                    </div>
                    {c.preset === OTHER && (
                      <div className={styles.colorSelect}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={c.hex}
                          onChange={(e) => updateColor(c.key, { hex: e.target.value })}
                          aria-label={`Tono del color ${i + 1}`}
                        />
                        <input
                          className={controlClass}
                          placeholder="Nombre del color"
                          value={c.name}
                          onChange={(e) => updateColor(c.key, { name: e.target.value })}
                          aria-label={`Nombre del color ${i + 1}`}
                          maxLength={24}
                        />
                      </div>
                    )}
                    {colors.length > 1 && (
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={() => setColors((prev) => prev.filter((x) => x.key !== c.key))}
                      >
                        Quitar color
                      </button>
                    )}
                  </div>
                </li>
              ))}
              <li>
                <button type="button" className={styles.addTile} onClick={() => setColors((prev) => [...prev, newColor()])}>
                  <span className={styles.uploadPlus} aria-hidden="true">
                    +
                  </span>
                  Añadir color
                </button>
              </li>
            </ul>
            {errors.colors && <p className={styles.error}>{errors.colors}</p>}
          </section>

          <section className={styles.panel} aria-labelledby="np-sizes">
            <h2 id="np-sizes" className={styles.panelTitle}>
              Tallas
            </h2>
            <div className={styles.sizeChips} role="group" aria-labelledby="np-sizes">
              {allSizes.map((s) => (
                <button key={s} type="button" className={styles.chip} aria-pressed={sizes.includes(s)} onClick={() => toggleSize(s)}>
                  {sizeGuide[s].label}
                </button>
              ))}
            </div>
            {errors.sizes && <p className={styles.error}>{errors.sizes}</p>}
          </section>

          <section className={styles.panel} aria-labelledby="np-stock">
            <div className={styles.panelHead}>
              <h2 id="np-stock" className={styles.panelTitle}>
                Cantidad
              </h2>
              <span className={styles.muted}>
                Total: {totalUnits} unidad{totalUnits === 1 ? '' : 'es'}
              </span>
            </div>
            <p className={styles.muted}>Unidades que subes de esta referencia, por color y talla.</p>
            <div className={styles.fillAll}>
              <label htmlFor="np-fill">Misma cantidad para todas</label>
              <input
                id="np-fill"
                className={styles.stockInput}
                inputMode="numeric"
                value={fillAll}
                onChange={(e) => setFillAll(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
              />
              <button type="button" className={styles.textButton} onClick={applyToAll}>
                Aplicar
              </button>
            </div>
            {sizes.length === 0 ? (
              <p className={styles.muted}>Elige al menos una talla para escribir las cantidades.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.stockTable}>
                  <thead>
                    <tr>
                      <th scope="col">Color</th>
                      {sizes.map((s) => (
                        <th key={s} scope="col">
                          {sizeGuide[s].label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map((c, i) => (
                      <tr key={c.key}>
                        <th scope="row">
                          <span className={styles.colorCell}>
                            {c.image ? (
                              <img src={c.image} alt="" className={styles.colorThumb} />
                            ) : (
                              <span className={styles.swatch} style={{ background: c.hex }} aria-hidden="true" />
                            )}
                            {c.name || `Color ${i + 1}`}
                          </span>
                        </th>
                        {sizes.map((s) => {
                          const v = unitsOf(c.key, s);
                          return (
                            <td key={s}>
                              <input
                                className={styles.stockInput}
                                inputMode="numeric"
                                value={v}
                                data-level={v === '' ? 'none' : Number(v) === 0 ? 'out' : 'ok'}
                                aria-invalid={!!errors.stock && v === ''}
                                onChange={(e) =>
                                  setStock((prev) => ({ ...prev, [draftKey(c.key, s)]: e.target.value.replace(/\D/g, '') }))
                                }
                                aria-label={`Unidades en ${c.name || `color ${i + 1}`}, talla ${sizeGuide[s].label}`}
                                placeholder="—"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {errors.stock && <p className={styles.error}>{errors.stock}</p>}
          </section>
        </div>

        <aside className={styles.formSide}>
          <section className={styles.panel} aria-labelledby="np-price-title">
            <h2 id="np-price-title" className={styles.panelTitle}>
              Precio
            </h2>
            <Field
              id="np-price"
              label="COP, IVA incluido"
              error={errors.price}
              hint={Number(price) ? formatPrice(Number(price)) : 'Sin puntos ni decimales'}
            >
              {(a11y) => (
                <input
                  {...a11y}
                  className={controlClass}
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="420000"
                />
              )}
            </Field>
          </section>


          <section className={styles.panel} aria-labelledby="np-publish">
            <h2 id="np-publish" className={styles.panelTitle}>
              Publicación
            </h2>
            <label className={styles.check}>
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
              Visible en la tienda
            </label>
            <label className={styles.check}>
              <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
              Etiqueta "Nuevo"
            </label>
            <label className={styles.check}>
              <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} />
              Etiqueta "Más vendido"
            </label>
          </section>

          <div className={styles.submitBox}>
            {errorCount > 0 && (
              <p className={styles.error} role="alert">
                {errors.form ?? 'Revisa los campos marcados.'}
              </p>
            )}
            <Button type="submit" className={styles.fullButton}>
              Subir producto
            </Button>
            <p className={styles.muted}>
              {totalUnits} unidad{totalUnits === 1 ? '' : 'es'} en {colors.length} color{colors.length === 1 ? '' : 'es'} ·{' '}
              {sizes.length} talla{sizes.length === 1 ? '' : 's'}
            </p>
          </div>
        </aside>
      </form>
    </>
  );
}
