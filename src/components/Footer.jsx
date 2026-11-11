import { brand, site } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

export default function Footer() {
  const logo = brand.full;
  return (
    <footer className="footer">
      <img className="footer__logo" src={asset(logo.src)} width={logo.width} height={logo.height} alt={logo.alt} />
      <div className="footer__cols">
        <nav aria-label="Pages">
          <a href="#sessions">Sessions</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#how">How we work</a>
          <a href="#light">The light</a>
          <a href="#book">Book a session</a>
        </nav>
        <nav aria-label="Elsewhere">
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={site.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={site.phoneHref}>{site.phoneDisplay}</a>
        </nav>
        <p>
          Dullstroom and the
          <br />
          surrounding areas,
          <br />
          Mpumalanga.
        </p>
      </div>
      <p className="footer__year">© {new Date().getFullYear()} Grace &amp; Light Photography</p>
    </footer>
  );
}
