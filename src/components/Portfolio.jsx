import { useCallback, useEffect, useRef, useState } from 'react';
import BlurText from './reactbits/BlurText.jsx';
import { categories, photos } from '../data/photos.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// The portfolio: every photograph, filterable, opening full-screen on a click.
export default function Portfolio() {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(-1);
  const opener = useRef(null);
  const shown = cat === 'All' ? photos : photos.filter(p => p.cat === cat);

  const close = useCallback(() => {
    setOpen(-1);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    by => setOpen(i => (i < 0 ? i : (i + by + shown.length) % shown.length)),
    [shown.length]
  );

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, step]);

  const current = open >= 0 ? shown[open] : null;

  return (
    <section className="section portfolio" id="portfolio">
      <div className="portfolio__top">
        <BlurText
          as="h2"
          className="head"
          text="The portfolio"
          delay={80}
          direction="bottom"
          blur={14}
          distance={26}
        />
        <div className="filters" role="group" aria-label="Show">
          {categories.map(c => (
            <button
              type="button"
              key={c}
              className="filter"
              aria-pressed={c === cat}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="masonry" key={cat}>
        {shown.map((p, i) => (
          <button
            type="button"
            className="shot"
            key={p.id}
            onClick={e => {
              opener.current = e.currentTarget;
              setOpen(i);
            }}
            aria-label={`Open photograph: ${p.alt}`}
          >
            <img
              src={asset(p.src)}
              width={p.width}
              height={p.height}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph"
          data-lenis-prevent
          onClick={close}
        >
          <img
            className="lightbox__img"
            src={asset(current.src)}
            width={current.width}
            height={current.height}
            alt={current.alt}
            onClick={e => e.stopPropagation()}
          />
          <button type="button" className="lightbox__btn lightbox__close" onClick={close} aria-label="Close">
            ×
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__prev"
            onClick={e => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photograph"
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__next"
            onClick={e => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photograph"
          >
            ›
          </button>
          <p className="lightbox__count">
            {open + 1} of {shown.length}
          </p>
        </div>
      )}
    </section>
  );
}
