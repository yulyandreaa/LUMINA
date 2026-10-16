import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { newId, useAccountData } from '../auth/useAccountData';
import { addBooking } from '../admin/adminAppointments';
import { examFaqs, examIncludes, examSteps } from '../data/eyeExam';
import { stores } from '../data/stores';
import { dateRange, examReasons, makeExamSchema, timeSlots, type ExamRequest } from '../lib/examSchema';
import { usePageTitle } from '../hooks/usePageTitle';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Field } from '../components/ui/Field';
import { controlClass } from '../components/ui/fieldStyles';
import { Reveal } from '../components/ui/Reveal';
import styles from './EyeExamPage.module.css';

/*
 * Servicio "Examen visual", con el formulario ARRIBA (lo más importante primero):
 * título + datos clave a la izquierda y el formulario de cita a la derecha;
 * debajo: qué incluye · cómo funciona · preguntas frecuentes.
 * La cita se guarda en la agenda del panel (demostración en este navegador; aún sin correo ni servidor).
 * Cuando LUMINA elija agenda real (Google Calendar, software de óptica…) se conecta en admin/adminAppointments.
 * Desde Tiendas se puede llegar con la tienda ya elegida: /examen-visual?tienda=usaquen#agendar
 */
type Errors = Partial<Record<string, string>>;

export function EyeExamPage() {
  usePageTitle('Examen visual');
  const [params] = useSearchParams();
  const preselected = stores.some((s) => s.id === params.get('tienda')) ? params.get('tienda')! : undefined;
  const [errors, setErrors] = useState<Errors>({});
  const [booked, setBooked] = useState<ExamRequest | null>(null);
  const { min, max } = dateRange();
  const { hash } = useLocation();
  const { customer } = useAuth();
  const account = useAccountData();
  // Con sesión, el formulario llega prellenado con los datos de la cuenta.
  const known = account.data.profile;
  const knownName = [known.firstName, known.lastName].filter(Boolean).join(' ') || undefined;

  // React Router no baja solo hasta un #ancla: lo hacemos al llegar desde Tiendas.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = makeExamSchema().safeParse({
      ...data,
      reason: data.reason || undefined,
      acceptData: data.acceptData === 'on',
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])));
      const first = Object.keys(fieldErrors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setBooked(parsed.data);
    const { store, date, time, fullName, phone, email, reason } = parsed.data;
    const appointment = { store, date, time, fullName, phone, email, reason, id: newId(), createdAt: new Date().toISOString() };
    // Toda solicitud llega a la agenda del panel de administración (Citas de examen).
    addBooking(appointment);
    // Con sesión iniciada, además queda en "Mi cuenta → Mis citas" (mismo id).
    if (customer) account.update((d) => ({ ...d, appointments: [...d.appointments, appointment] }));
  };

  return (
    <>
      <section className={styles.top}>
        <div className={`container ${styles.topGrid}`}>
          <div className={styles.topCopy}>
            <Eyebrow>Servicios</Eyebrow>
            <h1 className={styles.title}>Examen visual</h1>
            <p className={styles.intro}>
              Cuidamos tu forma de ver. Agenda tu examen en cualquiera de nuestras tiendas en Bogotá y sal con la
              montura que va contigo.
            </p>
            <dl className={styles.facts}>
              <div>
                <dt>Horario</dt>
                <dd>10:00 a. m. – 7:00 p. m.</dd>
              </div>
            </dl>
          </div>

          <div id="agendar" className={styles.panel}>
            {booked ? (
              <Confirmation request={booked} saved={!!customer} onReset={() => setBooked(null)} />
            ) : (
              <form className={styles.form} onSubmit={onSubmit} noValidate>
                <h2 className={styles.panelTitle}>Reserva tu cita</h2>
                <Field id="store" label="Tienda" error={errors.store}>
                  {(a) => (
                    <select {...a} name="store" defaultValue={preselected ?? ''} className={controlClass}>
                      <option value="" disabled>
                        Elige una tienda
                      </option>
                      {stores.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name.replace('Tienda LUMINA ', '')}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <div className={styles.row}>
                  <Field id="date" label="Día" error={errors.date}>
                    {(a) => <input {...a} name="date" type="date" min={min} max={max} className={controlClass} />}
                  </Field>
                  <Field id="time" label="Hora" error={errors.time}>
                    {(a) => (
                      <select {...a} name="time" defaultValue="" className={controlClass}>
                        <option value="" disabled>
                          Elige una hora
                        </option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>
                            {formatTime(t)}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
                <Field id="fullName" label="Nombre completo" error={errors.fullName}>
                  {(a) => <input {...a} name="fullName" defaultValue={knownName} autoComplete="name" className={controlClass} />}
                </Field>
                <div className={styles.row}>
                  <Field id="phone" label="Celular" error={errors.phone}>
                    {(a) => <input {...a} name="phone" type="tel" defaultValue={known.phone} autoComplete="tel" className={controlClass} />}
                  </Field>
                  <Field id="email" label="Correo electrónico" error={errors.email}>
                    {(a) => <input {...a} name="email" type="email" defaultValue={customer?.email} autoComplete="email" className={controlClass} />}
                  </Field>
                </div>
                <Field id="reason" label="Motivo de la visita" optional>
                  {(a) => (
                    <select {...a} name="reason" defaultValue="" className={controlClass}>
                      <option value="">Prefiero no decirlo</option>
                      {examReasons.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <label className={styles.check}>
                  <input type="checkbox" name="acceptData" aria-invalid={!!errors.acceptData} />
                  <span>
                    Autorizo el <Link to="/tratamiento-de-datos">tratamiento de mis datos personales</Link> para
                    gestionar mi cita (Ley 1581 de 2012).
                  </span>
                </label>
                {errors.acceptData && <p className={styles.error}>{errors.acceptData}</p>}
                <Button type="submit" withArrow className={styles.submit}>
                  Solicitar cita
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.head}>
          <Eyebrow>Qué incluye</Eyebrow>
          <h2 className={styles.sectionTitle}>Un examen completo, sin prisa.</h2>
        </div>
        <ol className={styles.includes}>
          {examIncludes.map((item, i) => (
            <li key={item.title}>
              <Reveal className={styles.include}>
                <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemText}>{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.head}>
          <Eyebrow>Cómo funciona</Eyebrow>
          <h2 className={styles.sectionTitle}>Tres pasos.</h2>
        </div>
        <ol className={styles.steps}>
          {examSteps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={styles.itemTitle}>{step.title}</h3>
              <p className={styles.itemText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container ${styles.section} ${styles.faq}`}>
        <div className={styles.head}>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className={styles.sectionTitle}>Antes de tu cita.</h2>
        </div>
        <Accordion
          group="exam-faq"
          items={examFaqs.map((f, i) => ({ id: `exam-faq-${i}`, title: f.q, content: <p>{f.a}</p> }))}
        />
      </section>
    </>
  );
}

function Confirmation({ request, saved, onReset }: { request: ExamRequest; saved: boolean; onReset: () => void }) {
  const store = stores.find((s) => s.id === request.store);
  const date = new Date(`${request.date}T12:00:00`).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className={styles.confirmation} role="status">
      <p className={styles.confirmTitle}>¡Listo, {request.fullName.split(' ')[0]}! Recibimos tu solicitud.</p>
      <dl className={styles.summary}>
        <dt>Tienda</dt>
        <dd>{store?.name}</dd>
        <dt>Día</dt>
        <dd>{date}</dd>
        <dt>Hora</dt>
        <dd>{formatTime(request.time)}</dd>
      </dl>
      <p className={styles.pending}>
        Te confirmaremos la cita. Versión de demostración: aún no llega correo de confirmación.
      </p>
      {saved && (
        <Link to="/cuenta/citas" className="text-link">
          Ver en Mis citas
        </Link>
      )}
      <button type="button" className="text-link" onClick={onReset}>
        Agendar otra cita
      </button>
    </div>
  );
}

/** "14:00" → "2:00 p. m." */
function formatTime(t: string) {
  const h = Number(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}:00 ${h < 12 ? 'a. m.' : 'p. m.'}`;
}
