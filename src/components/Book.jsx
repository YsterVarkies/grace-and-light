import { useEffect, useMemo, useState } from 'react';
import { sessions, site } from '../data/site.js';
import { photos } from '../data/photos.js';
import { addDays, clock, longDate, sunTimes, todayInDullstroom } from '../lib/sun.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// The close of the page: choose a session and a date, read that evening's
// golden hour, and send the request as a ready-written WhatsApp message.
export default function Book() {
  const today = useMemo(() => todayInDullstroom(), []);
  const [session, setSession] = useState(sessions[1].name);
  const [date, setDate] = useState(() => addDays(today, 10));
  const p = photos.find(x => x.id === 'portrait-smile');

  // A "Book ..." button on a session card picks that session here.
  useEffect(() => {
    const pick = e => sessions.some(s => s.name === e.detail) && setSession(e.detail);
    window.addEventListener('pick-session', pick);
    return () => window.removeEventListener('pick-session', pick);
  }, []);

  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const times = valid ? sunTimes(date) : null;
  const gold = times ? `${clock(times.eveningStart)} to ${clock(times.sunset)}` : null;

  const message = valid
    ? `Hello Grace & Light. I would like to book a ${session.toLowerCase()} session on ${longDate(date)}. Golden hour that evening is ${gold}.`
    : `Hello Grace & Light. I would like to book a ${session.toLowerCase()} session.`;
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <section className="section book" id="book">
      <div className="book__grid">
        <div className="book__words" data-rise>
          <p className="script">Where grace meets light</p>
          <h2 className="head">I look forward to capturing your story.</h2>
          <p>
            Call or message <a href={site.phoneHref}>{site.phoneDisplay}</a>, or find Grace &amp; Light on{' '}
            <a href={site.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>{' '}
            and{' '}
            <a href={site.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            .
          </p>
          <figure className="arch book__pic">
            <img src={asset(p.src)} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
          </figure>
        </div>

        <div className="card" data-rise="self">
          <h3 className="card__title">Book a session</h3>

          <fieldset className="field">
            <legend>Which session?</legend>
            <div className="chips">
              {sessions.map(s => (
                <label className="chip" key={s.id}>
                  <input
                    type="radio"
                    name="session"
                    value={s.name}
                    checked={session === s.name}
                    onChange={() => setSession(s.name)}
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Which day?</span>
            <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} />
          </label>

          <p className="card__gold" aria-live="polite">
            {gold ? (
              <>
                Golden hour that evening <strong>{gold}</strong>
              </>
            ) : (
              'Pick a day to see its golden hour.'
            )}
          </p>

          <a className="btn btn--wide" href={href} target="_blank" rel="noreferrer">
            Send on WhatsApp
          </a>
          <p className="card__call">
            Or call <a href={site.phoneHref}>{site.phoneDisplay}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
