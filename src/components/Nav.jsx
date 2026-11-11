import { brand } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

export default function Nav() {
  const logo = brand.nav;
  return (
    <header className="nav">
      <a className="nav__mark" href="#top" aria-label="Grace & Light Photography, back to the top">
        <img src={asset(logo.src)} width={logo.width} height={logo.height} alt="" />
      </a>
      <nav className="nav__links" aria-label="Sections">
        <a href="#sessions">Sessions</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#how">How we work</a>
        <a href="#light">The light</a>
      </nav>
      <a className="btn btn--small" href="#book">
        Book a session
      </a>
    </header>
  );
}
