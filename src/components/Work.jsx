import BlurText from './reactbits/BlurText.jsx';
import { site, work } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// Two recent guesthouse shoots, hung at different sizes down a diagonal.
// The list is built for two; a third entry would need its own placement in
// styles.css (.work__photo--c, .work__text--c).
export default function Work() {
  const marks = ['a', 'b'];
  return (
    <section className="section work" id="work">
      <div className="grid">
        <BlurText
          as="h2"
          className="head work__head"
          text="Recent work"
          delay={80}
          direction="bottom"
          blur={14}
          distance={26}
        />

        {work.slice(0, 2).map((w, i) => (
          <div className="work__item" key={w.id}>
            <figure className={`frame work__photo work__photo--${marks[i]}`} data-rise="self">
              <img
                data-drift
                src={asset(w.photo.src)}
                width={w.photo.width}
                height={w.photo.height}
                alt={w.photo.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className={`work__text work__text--${marks[i]}`} data-rise>
              <h3>{w.name}</h3>
              <p>{w.text}</p>
              <p className="note">{w.kind}</p>
            </div>
          </div>
        ))}

        <p className="work__more" data-rise="self">
          There is more on{' '}
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          .
        </p>
      </div>
    </section>
  );
}
