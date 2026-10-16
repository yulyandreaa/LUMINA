import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { newId, useAccountData } from '../../auth/useAccountData';
import { addressSchema, profileSchema, removeAddress, upsertAddress, type Address } from '../../lib/accountSchema';
import { fieldErrors } from '../../lib/authSchema';
import { departments, legalIdTypes } from '../../lib/checkoutSchema';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { controlClass } from '../../components/ui/fieldStyles';
import { SectionHead } from './AccountLayout';
import styles from './Account.module.css';

/*
 * Datos y direcciones:
 * 1. Tus datos (nombre, celular, documento) para no escribirlos en cada compra.
 * 2. Direcciones de envío: tarjetas con editar / eliminar / marcar como principal.
 */
type Errors = Record<string, string | undefined>;

export function ProfilePage() {
  usePageTitle('Datos y direcciones');
  const { customer } = useAuth();
  const { data, update } = useAccountData();
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);
  /** null = sin formulario abierto · 'new' = nueva · id = editando esa dirección. */
  const [editing, setEditing] = useState<string | null>(null);
  const profile = data.profile;

  const onProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = profileSchema.safeParse({ ...raw, legalIdType: raw.legalIdType || undefined });
    if (!parsed.success) {
      setSaved(false);
      return setErrors(fieldErrors(parsed.error));
    }
    setErrors({});
    update((d) => ({ ...d, profile: parsed.data }));
    setSaved(true);
  };

  return (
    <>
      <SectionHead title="Datos y direcciones" />

      <section className={styles.block}>
        <h2 className={styles.subTitle}>Tus datos</h2>
        <form className={styles.form} onSubmit={onProfile} onChange={() => setSaved(false)} noValidate>
          <div className={styles.row}>
            <Field id="firstName" label="Nombre" error={errors.firstName}>
              {(a) => <input {...a} name="firstName" defaultValue={profile.firstName} autoComplete="given-name" className={controlClass} />}
            </Field>
            <Field id="lastName" label="Apellido" error={errors.lastName}>
              {(a) => <input {...a} name="lastName" defaultValue={profile.lastName} autoComplete="family-name" className={controlClass} />}
            </Field>
          </div>
          <div className={styles.row}>
            <Field id="email" label="Correo electrónico" hint="Es el correo con el que entras; no se puede cambiar aquí.">
              {(a) => <input {...a} value={customer?.email} readOnly className={controlClass} />}
            </Field>
            <Field id="phone" label="Celular" optional error={errors.phone}>
              {(a) => <input {...a} name="phone" type="tel" defaultValue={profile.phone} autoComplete="tel" className={controlClass} />}
            </Field>
          </div>
          <div className={styles.row}>
            <Field id="legalIdType" label="Tipo de documento" optional>
              {(a) => (
                <select {...a} name="legalIdType" defaultValue={profile.legalIdType ?? ''} className={controlClass}>
                  <option value="">Sin especificar</option>
                  {legalIdTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field id="legalId" label="Número de documento" optional error={errors.legalId}>
              {(a) => <input {...a} name="legalId" defaultValue={profile.legalId} className={controlClass} />}
            </Field>
          </div>
          <div className={styles.formActions}>
            <Button type="submit">Guardar datos</Button>
            {saved && (
              <p className={styles.saved} role="status">
                Datos guardados.
              </p>
            )}
          </div>
        </form>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className={styles.subTitle}>Direcciones de envío</h2>
          {editing === null && (
            <button type="button" className="text-link" onClick={() => setEditing('new')}>
              + Agregar dirección
            </button>
          )}
        </div>

        {editing === 'new' && (
          <AddressForm
            onCancel={() => setEditing(null)}
            onSave={(a) => {
              update((d) => ({ ...d, addresses: upsertAddress(d.addresses, a) }));
              setEditing(null);
            }}
          />
        )}

        {data.addresses.length === 0 && editing === null && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Aún no tienes direcciones guardadas.</p>
            <p className={styles.muted}>Guárdalas aquí para comprar más rápido.</p>
          </div>
        )}

        <ul className={styles.addresses}>
          {data.addresses.map((a) =>
            editing === a.id ? (
              <li key={a.id} className={styles.addressWide}>
                <AddressForm
                  initial={a}
                  onCancel={() => setEditing(null)}
                  onSave={(next) => {
                    update((d) => ({ ...d, addresses: upsertAddress(d.addresses, next) }));
                    setEditing(null);
                  }}
                />
              </li>
            ) : (
              <li key={a.id} className={styles.address}>
                <p className={styles.cardTitle}>
                  {a.label}
                  {a.isDefault && <span className={styles.badge}>Principal</span>}
                </p>
                <p>{a.address}</p>
                {a.address2 && <p>{a.address2}</p>}
                <p className={styles.muted}>
                  {a.city}, {a.region}
                </p>
                <div className={styles.addressActions}>
                  <button type="button" className="text-link" onClick={() => setEditing(a.id)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => update((d) => ({ ...d, addresses: removeAddress(d.addresses, a.id) }))}
                  >
                    Eliminar
                  </button>
                  {!a.isDefault && (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => update((d) => ({ ...d, addresses: upsertAddress(d.addresses, { ...a, isDefault: true }) }))}
                    >
                      Usar como principal
                    </button>
                  )}
                </div>
              </li>
            ),
          )}
        </ul>
      </section>
    </>
  );
}

function AddressForm({ initial, onSave, onCancel }: { initial?: Address; onSave: (a: Address) => void; onCancel: () => void }) {
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = addressSchema.safeParse({ ...raw, isDefault: raw.isDefault === 'on' });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    onSave({ ...parsed.data, id: initial?.id ?? newId() });
  };

  const prefix = initial?.id ?? 'new';
  return (
    <form className={`${styles.form} ${styles.addressForm}`} onSubmit={onSubmit} noValidate>
      <p className={styles.cardTitle}>{initial ? 'Editar dirección' : 'Nueva dirección'}</p>
      <Field id={`${prefix}-label`} label="Nombre de la dirección" error={errors.label} hint="Por ejemplo: Casa, Oficina.">
        {(a) => <input {...a} name="label" defaultValue={initial?.label} className={controlClass} />}
      </Field>
      <div className={styles.row}>
        <Field id={`${prefix}-region`} label="Departamento" error={errors.region}>
          {(a) => (
            <select {...a} name="region" defaultValue={initial?.region ?? 'Bogotá D.C.'} className={controlClass}>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          )}
        </Field>
        <Field id={`${prefix}-city`} label="Ciudad o municipio" error={errors.city}>
          {(a) => <input {...a} name="city" defaultValue={initial?.city} autoComplete="address-level2" className={controlClass} />}
        </Field>
      </div>
      <Field id={`${prefix}-address`} label="Dirección" error={errors.address}>
        {(a) => <input {...a} name="address" defaultValue={initial?.address} autoComplete="address-line1" className={controlClass} />}
      </Field>
      <Field id={`${prefix}-address2`} label="Apartamento, torre, oficina" optional>
        {(a) => <input {...a} name="address2" defaultValue={initial?.address2} autoComplete="address-line2" className={controlClass} />}
      </Field>
      <label className={styles.check}>
        <input type="checkbox" name="isDefault" defaultChecked={initial?.isDefault} />
        <span>Usar como dirección principal</span>
      </label>
      <div className={styles.formActions}>
        <Button type="submit">Guardar dirección</Button>
        <button type="button" className="text-link" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
