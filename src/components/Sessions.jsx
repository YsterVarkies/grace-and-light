import BlurText from './reactbits/BlurText.jsx';
import { sessions } from '../data/site.js';

// One pinned screen. The camera stays (on the right; in the middle on a phone)
// and turns to a new angle for each kind of session while the words change
// beside it. Its iris opens wide for portraits and closes right down for rooms.
// lib/scroll.js drives the stepping; without it the four sessions simply stack.
export default function Sessions() {
  return (
    <section className="sessions" id="sessions">
      <div className="sessions__panel grid">
        <BlurText
          as="h2"
          className="head sessions__head"
          text="What I photograph"
          delay={80}
          direction="bottom"
          blur={14}
          distance={26}
        />

        <div className="tabs" role="group" aria-label="Kinds of session">
          {sessions.map((s, i) => (
            <button type="button" key={s.id} data-step={i} aria-current={i === 0 ? 'true' : undefined}>
              {s.name}
            </button>
          ))}
        </div>

        <div className="sessions__stack">
          {sessions.map(s => (
            <article className="session" key={s.id} id={s.id}>
              <h3 className="head">{s.name}</h3>
              <p>{s.text}</p>
              <ul className="facts">
                {s.facts.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
