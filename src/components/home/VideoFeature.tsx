import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import styles from './VideoFeature.module.css';

/*
 * Vídeo de marca a todo el ancho, de fondo: silenciado, en bucle y sin controles nativos.
 * - Se reproduce solo cuando está en pantalla (ahorra batería y datos) y se pausa al salir.
 * - Botón de pausa siempre visible (WCAG 2.2.2: el movimiento de más de 5 s debe poder pararse).
 * - Con "reducir movimiento" activado no arranca solo.
 * Si no hay `src`, muestra el póster con el aviso "Vídeo pendiente".
 */
interface VideoFeatureProps {
  poster: string;
  title: string;
  src?: string;
}

export function VideoFeature({ poster, title, src }: VideoFeatureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) userPaused.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else if (!entry.isIntersecting) {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      void v.play().then(() => setPlaying(true));
    } else {
      userPaused.current = true;
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className={styles.section} aria-label={title}>
      {src ? (
        <video
          ref={videoRef}
          className={styles.media}
          poster={poster}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <img className={styles.media} src={poster} alt="" loading="lazy" />
      )}
      <div className={`container ${styles.overlay}`}>
        <h2 className={styles.title}>{title}</h2>
        {src ? (
          <button className={styles.play} onClick={toggle} aria-label={playing ? 'Pausar vídeo' : 'Reproducir vídeo'}>
            <Icon name={playing ? 'pause' : 'play'} size={22} />
          </button>
        ) : (
          <span className={styles.pending}>Vídeo pendiente</span>
        )}
      </div>
    </section>
  );
}
