import { Link } from 'react-router-dom';
import { stores } from '../data/stores';
import { usePageTitle } from '../hooks/usePageTitle';
import { Eyebrow } from '../components/ui/Eyebrow';
import styles from './StoresPage.module.css';

/*
 * Tiendas (como la página de tiendas de la referencia):
 * rejilla de 3 tarjetas · foto de fachada · ciudad · línea · nombre · datos · enlaces.
 * Sin dirección no se muestra esa línea; teléfono/horario faltantes se muestran como "pendiente", nunca inventados.
 */
export function StoresPage() {
  usePageTitle('Tiendas');

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Eyebrow>Visítanos</Eyebrow>
        <h1 className={styles.title}>Nuestras tiendas</h1>
        <p className={styles.intro}>Pruébate las monturas en persona y recibe asesoría de ajuste en nuestras sedes de Bogotá.</p>
      </header>

      <ul className={styles.grid}>
        {stores.map((s) => (
          <li key={s.id} className={styles.card}>
            <img src={s.image} alt={s.alt} loading="lazy" className={styles.image} />
            <p className={styles.city}>{s.city}</p>
            <h2 className={styles.name}>{s.name}</h2>
            <div className={styles.details}>
              {s.address && <p>{s.address}</p>}
              <p>{s.phone ? <a href={`tel:${s.phone.replace(/\D/g, '')}`}>{s.phone}</a> : <Pending>Teléfono</Pending>}</p>
              <p>{s.hours ? `Horario: ${s.hours}` : <Pending>Horario</Pending>}</p>
            </div>
            <div className={styles.links}>
              <Link to={`/examen-visual?tienda=${s.id}#agendar`} className="text-link">
                Agenda tu examen visual
              </Link>
              <Link to="/contacto" className="text-link">
                Contáctanos
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Pending({ children }: { children: string }) {
  return <span className={styles.pending}>{children} pendiente de confirmar</span>;
}
