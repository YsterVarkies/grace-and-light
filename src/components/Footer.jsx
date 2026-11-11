import { site } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__what">Grace &amp; Light Photography, Dullstroom</p>
      <nav className="footer__links" aria-label="Elsewhere">
        <a href={site.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={site.facebook} target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href={site.phoneHref}>{site.phoneDisplay}</a>
      </nav>
      <p className="footer__year">© {new Date().getFullYear()}</p>
    </footer>
  );
}
