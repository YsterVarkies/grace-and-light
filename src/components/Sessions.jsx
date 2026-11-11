import BlurText from './reactbits/BlurText.jsx';
import { brand, sessions } from '../data/site.js';
import { photos } from '../data/photos.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// Four kinds of session, each a coloured card with a photograph from the portfolio.
export default function Sessions() {
  const logo = brand.full;
  const choose = name => window.dispatchEvent(new CustomEvent('pick-session', { detail: name }));

  return (
    <section className="section sessions" id="sessions">
      <div className="sessions__top">
        <BlurText
          as="h2"
          className="head"
          text="What I photograph"
          delay={80}
          direction="bottom"
          blur={14}
          distance={26}
        />
        <p className="sessions__lead">Couples, families, portraits, guesthouses and lifestyle, in Dullstroom and the surrounding areas.</p>
      </div>

      <div className="cards" data-rise>
        {sessions.map(s => {
          const p = s.photo ? photos.find(x => x.id === s.photo) : null;
          return (
            <article className={`session session--${s.tint}`} key={s.id} id={s.id}>
              <div className="session__pic">
                {p ? (
                  <img
                    src={asset(p.src)}
                    width={p.width}
                    height={p.height}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <img
                    className="session__logo"
                    src={asset(logo.src)}
                    width={logo.width}
                    height={logo.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <ul className="facts">
                {s.facts.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className="btn btn--small" href="#book" onClick={() => choose(s.name)}>
                Book {s.name.toLowerCase()}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
