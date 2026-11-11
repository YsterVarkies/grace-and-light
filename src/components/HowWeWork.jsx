import BlurText from './reactbits/BlurText.jsx';
import { steps } from '../data/site.js';

// Three steps, from the first message to the finished gallery.
export default function HowWeWork() {
  return (
    <section className="section how" id="how">
      <div className="how__top">
        <BlurText
          as="h2"
          className="head"
          text="How we work"
          delay={80}
          direction="bottom"
          blur={14}
          distance={26}
        />
        <p className="how__lead">From your first message to the finished gallery.</p>
      </div>

      <ol className="steps" data-rise>
        {steps.map((s, i) => (
          <li className={`step step--${s.tint}`} key={s.title}>
            <span className="step__num" aria-hidden="true">
              {i + 1}
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
