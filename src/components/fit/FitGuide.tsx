import { Link } from 'react-router-dom';
import { sizeGuide } from '../../data/sizes';
import { faceShapes, fitChecklist, measurements, steps, templeExample } from '../../data/fitGuide';
import styles from './FitGuide.module.css';

/*
 * Página "Talla y ajuste": cómo leer las medidas (con dibujo), cómo saber tu talla,
 * tallas LUMINA, forma del rostro y señales de un buen ajuste.
 * La guía corta del modal de producto sigue en components/product/SizeGuide.
 */
export function FitGuide() {
  return (
    <div className={styles.guide}>
      <p className={styles.lead}>
        Unas gafas bien ajustadas se sienten ligeras, no se resbalan y dejan tus ojos justo en el centro de cada lente.
        Para acertar solo necesitas tres números y unos minutos frente al espejo.
      </p>

      {/* 1. Las medidas */}
      <section className={styles.section} aria-labelledby="fit-medidas">
        <h2 id="fit-medidas" className={styles.heading}>
          Cómo leer las medidas
        </h2>
        <p className={styles.text}>
          Casi todas las monturas llevan sus medidas grabadas en la cara interior de la patilla, en milímetros y
          siempre en el mismo orden.
        </p>

        <figure className={styles.diagram}>
          <FrameDiagram />
          <figcaption className={styles.engraving}>
            <span>{templeExample.lens}</span>
            <span aria-hidden="true">□</span>
            <span>{templeExample.bridge}</span>
            <span>{templeExample.temple}</span>
            <small>Ejemplo de lo que verás en la patilla</small>
          </figcaption>
        </figure>

        <dl className={styles.measures}>
          {measurements.map((m, i) => (
            <div key={m.id} className={styles.measure}>
              <dt>
                <span className={styles.num}>{i + 1}</span>
                {m.label}
              </dt>
              <dd>{m.text}</dd>
              <dd className={styles.range}>Rango habitual: {m.range}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 2. Paso a paso */}
      <section className={styles.section} aria-labelledby="fit-pasos">
        <h2 id="fit-pasos" className={styles.heading}>
          ¿Cómo saber mi talla?
        </h2>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.stepNum}>0{i + 1}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3. Tallas LUMINA */}
      <section className={styles.section} aria-labelledby="fit-tallas">
        <h2 id="fit-tallas" className={styles.heading}>
          Tallas LUMINA
        </h2>
        <p className={styles.fictional}>Medidas de ejemplo (ficticias), pendientes de confirmar por modelo.</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Talla</th>
                <th scope="col">Lente</th>
                <th scope="col">Puente</th>
                <th scope="col">Patilla</th>
                <th scope="col">Frente</th>
                <th scope="col">Para ti si…</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(sizeGuide).map((s) => (
                <tr key={s.id}>
                  <th scope="row">
                    <Link to={`/monturas?talla=${s.id}`} className={styles.sizeLink}>
                      {s.label}
                    </Link>
                  </th>
                  <td>{s.lensWidth} mm</td>
                  <td>{s.bridge} mm</td>
                  <td>{s.temple} mm</td>
                  <td>{s.frameWidth} mm</td>
                  <td className={styles.advice}>{s.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Forma del rostro */}
      <section className={styles.section} aria-labelledby="fit-rostro">
        <h2 id="fit-rostro" className={styles.heading}>
          Según la forma de tu rostro
        </h2>
        <p className={styles.text}>
          No es una regla: es un punto de partida. La idea general es buscar contraste, con curvas para rostros de
          líneas rectas y ángulos para rostros de líneas suaves.
        </p>
        <ul className={styles.faces}>
          {faceShapes.map((f) => (
            <li key={f.name} className={styles.face}>
              <h3 className={styles.faceName}>Rostro {f.name.toLowerCase()}</h3>
              <p className={styles.traits}>{f.traits}</p>
              <p>{f.tip}</p>
              <p className={styles.faceLinks}>
                {f.shapes.map((s) => (
                  <Link key={s.id} to={`/monturas?forma=${s.id}`} className="text-link">
                    {s.label}
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Buen ajuste */}
      <section className={styles.section} aria-labelledby="fit-ajuste">
        <h2 id="fit-ajuste" className={styles.heading}>
          Señales de un buen ajuste
        </h2>
        <ul className={styles.checklist}>
          {fitChecklist.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {/* 6. Cierre */}
      <aside className={styles.cta}>
        <p className={styles.ctaTitle}>¿Prefieres que te ayudemos en persona?</p>
        <p>Visítanos en cualquiera de nuestras 3 tiendas en Bogotá y te acompañamos a encontrar la montura que va contigo.</p>
        <div className={styles.ctaLinks}>
          <Link to="/tiendas" className="text-link">
            Ver tiendas
          </Link>
          <Link to="/examen-visual" className="text-link">
            Agendar examen visual
          </Link>
        </div>
      </aside>
    </div>
  );
}

/* Dibujo de línea de una montura vista de frente y de lado, con las tres medidas numeradas. */
function FrameDiagram() {
  return (
    <svg viewBox="0 0 560 300" className={styles.svg} role="img" aria-label="Dibujo de una montura con el ancho de lente, el puente y la patilla señalados">
      {/* Frente */}
      <g className={styles.frame}>
        <rect x="70" y="60" width="170" height="120" rx="54" />
        <rect x="320" y="60" width="170" height="120" rx="54" />
        <path d="M240 98 C 262 80, 298 80, 320 98" />
        <path d="M70 92 L 40 86" />
        <path d="M490 92 L 520 86" />
      </g>
      {/* 1 · ancho de lente */}
      <g className={styles.dim}>
        <path d="M70 40 H240 M70 34 V46 M240 34 V46" />
        <circle cx="155" cy="22" r="11" className={styles.badge} />
        <text x="155" y="26">1</text>
      </g>
      {/* 2 · puente */}
      <g className={styles.dim}>
        <path d="M240 200 H320 M240 194 V206 M320 194 V206" />
        <circle cx="280" cy="222" r="11" className={styles.badge} />
        <text x="280" y="226">2</text>
      </g>
      {/* Patilla vista de lado */}
      <g className={styles.frame}>
        <path d="M70 262 H430 C 452 262, 466 270, 474 288" />
      </g>
      {/* 3 · patilla */}
      <g className={styles.dim}>
        <path d="M70 246 H474 M70 240 V252 M474 240 V252" />
        <circle cx="500" cy="246" r="11" className={styles.badge} />
        <text x="500" y="250">3</text>
      </g>
    </svg>
  );
}
