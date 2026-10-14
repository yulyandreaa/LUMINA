import { useEffect, useRef, useState, type ReactNode } from 'react';

/*
 * Aparición al hacer scroll, como en la referencia (intersect.once con margen de 200px):
 * el contenido sube y se hace visible una sola vez cuando entra en pantalla.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={['reveal', className].filter(Boolean).join(' ')} data-visible={visible}>
      {children}
    </div>
  );
}
