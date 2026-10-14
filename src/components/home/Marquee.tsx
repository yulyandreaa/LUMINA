import styles from './Marquee.module.css';

/*
 * Franja de texto en movimiento continuo, a todo el ancho.
 * La pista lleva dos grupos idénticos y se desplaza la mitad de su ancho, así vuelve
 * al inicio sin salto visible. Cada grupo repite la frase para cubrir pantallas muy anchas.
 * Lo que se mueve es decorativo (aria-hidden): los lectores de pantalla leen la frase una sola vez.
 * Se pausa al pasar el ratón; con "reducir movimiento" queda quieta (regla global en base.css).
 */
const REPEAT = 4;

export function Marquee({ items }: { items: string[] }) {
  const group = Array.from({ length: REPEAT }, () => items).flat();

  return (
    <section className={styles.marquee}>
      <p className="visually-hidden">{items.join('. ')}</p>
      <div className={styles.track} aria-hidden="true">
        {[0, 1].map((copy) => (
          <span key={copy} className={styles.group}>
            {group.map((item, i) => (
              <span key={i} className={styles.item}>
                {item}
                <span className={styles.separator}>✳</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
