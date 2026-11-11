import SplitText from './reactbits/SplitText.jsx';
import Magnet from './reactbits/Magnet.jsx';
import { photos } from '../data/photos.js';
import { reveal } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// Soft out-of-focus lights drifting behind the camera. x, y and size are in
// the hero's own units; c is the colour of each light.
const bokeh = [
  { x: '6%', y: '14%', s: '26vw', c: 'rgba(255, 214, 160, 0.75)', d: '17s' },
  { x: '62%', y: '4%', s: '30vw', c: 'rgba(255, 255, 255, 0.9)', d: '21s' },
  { x: '80%', y: '34%', s: '22vw', c: 'rgba(255, 190, 170, 0.6)', d: '19s' },
  { x: '30%', y: '40%', s: '16vw', c: 'rgba(255, 238, 200, 0.85)', d: '15s' },
  { x: '-4%', y: '58%', s: '20vw', c: 'rgba(190, 215, 240, 0.7)', d: '23s' },
  { x: '48%', y: '58%', s: '14vw', c: 'rgba(255, 205, 150, 0.6)', d: '18s' }
];

// The first screen and the scroll scene that follows it: the 3D camera turns
// to face you, the page goes in through the lens, and one of her photographs
// develops out of the light on the other side.
export default function Dive() {
  const p = photos.find(x => x.id === reveal.id);
  return (
    <section className="dive" id="top" aria-label="Grace & Light Photography">
      <div className="hero">
        <div className="hero__bokeh" aria-hidden="true">
          {bokeh.map((b, i) => (
            <i key={i} style={{ '--x': b.x, '--y': b.y, '--s': b.s, '--c': b.c, '--d': b.d }} />
          ))}
        </div>

        <div className="hero__script" aria-hidden="true">
          Where grace meets light
        </div>
        <div className="hero__name">
          <SplitText
            tag="h1"
            text="Grace & Light"
            splitType="chars"
            trigger="load"
            delay={38}
            duration={1.2}
            ease="power4.out"
            from={{ opacity: 0, yPercent: 35 }}
            to={{ opacity: 1, yPercent: 0 }}
            textAlign="left"
            className="hero__title"
          />
        </div>
        <div className="hero__meta">
          <p className="hero__line">
            Portrait, family and guesthouse photography in Dullstroom, Mpumalanga.
          </p>
          <div className="hero__actions">
            <a className="btn btn--ghost" href="#book">
              Book a session
            </a>
            <Magnet padding={70} magnetStrength={5}>
              <a className="btn" href="#portfolio">
                View the portfolio
              </a>
            </Magnet>
          </div>
        </div>
      </div>

      <div className="reveal">
        <div className="reveal__frame">
          <img
            className="reveal__img"
            src={asset(p.src)}
            width={p.width}
            height={p.height}
            alt={p.alt}
          />
        </div>
        <div className="reveal__text">
          <h2 className="reveal__title">
            <span className="reveal__line">
              <span>Where grace</span>
            </span>
            <span className="reveal__line">
              <span>meets light.</span>
            </span>
          </h2>
          <p className="reveal__note">{reveal.caption}</p>
        </div>
      </div>

      <div className="flash" aria-hidden="true" />
    </section>
  );
}
