import SplitText from './reactbits/SplitText.jsx';
import Magnet from './reactbits/Magnet.jsx';
import { pictures } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// The first screen and the scroll scene that follows it: the 3D camera turns
// to face you, the page goes in through the lens, and one of her photographs
// develops out of the light on the other side.
export default function Dive() {
  const p = pictures.reveal;
  return (
    <section className="dive" id="top" aria-label="Grace & Light Photography">
      <div className="hero">
        <div className="hero__name">
          <SplitText
            tag="h1"
            text="Grace & Light"
            splitType="chars"
            mask
            trigger="load"
            delay={38}
            duration={1.2}
            ease="power4.out"
            from={{ yPercent: 108 }}
            to={{ yPercent: 0 }}
            textAlign="left"
            className="hero__title"
          />
        </div>
        <div className="hero__meta">
          <p className="hero__line">
            Portrait, couple, family and guesthouse photography in Dullstroom, Mpumalanga.
          </p>
          <div className="hero__actions">
            <span className="hero__cue">Scroll to look through the lens</span>
            <Magnet padding={70} magnetStrength={5}>
              <a className="btn" href="#book">
                Book a session
              </a>
            </Magnet>
          </div>
        </div>
      </div>

      <div className="reveal">
        <div className="reveal__frame">
          <img className="reveal__img" src={asset(p.src)} width={p.width} height={p.height} alt={p.alt} />
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
          <p className="reveal__note">{p.caption}</p>
        </div>
      </div>

      <div className="flash" aria-hidden="true" />
    </section>
  );
}
