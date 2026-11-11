import { useEffect, useState } from 'react';
import { brand } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

const links = [
  ['#sessions', 'Sessions'],
  ['#portfolio', 'Portfolio'],
  ['#how', 'How we work'],
  ['#light', 'The light']
];

export default function Nav() {
  const logo = brand.nav;
  const [open, setOpen] = useState(false);

  // The menu closes on Escape, on scrolling, and if the screen grows past the
  // phone and tablet layout.
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onKey = e => e.key === 'Escape' && close();
    const wide = window.matchMedia('(min-width: 961px)');
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, { passive: true });
    wide.addEventListener('change', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close);
      wide.removeEventListener('change', close);
    };
  }, [open]);

  return (
    <header className={`nav${open ? ' is-open' : ''}`}>
      <a className="nav__mark" href="#top" aria-label="Grace & Light Photography, back to the top">
        <img src={asset(logo.src)} width={logo.width} height={logo.height} alt="" />
      </a>

      <nav className="nav__links" aria-label="Sections">
        {links.map(([href, label]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>

      <a className="btn btn--small nav__book" href="#book">
        Book a session
      </a>

      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(o => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="menu" className="menu" aria-label="Menu" aria-hidden={!open}>
        {links.map(([href, label]) => (
          <a href={href} key={href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a className="btn" href="#book" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          Book a session
        </a>
      </nav>
    </header>
  );
}
