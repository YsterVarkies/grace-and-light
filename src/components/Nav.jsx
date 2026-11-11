export default function Nav() {
  return (
    <header className="nav">
      <a className="nav__mark" href="#top" aria-label="Grace & Light Photography, back to the top">
        Grace &amp; Light <span className="nav__kind">Photography</span>
      </a>
      <nav className="nav__links" aria-label="Sections">
        <a href="#sessions">Sessions</a>
        <a href="#work">Recent work</a>
        <a href="#light">The light</a>
      </nav>
      <a className="btn btn--small" href="#book">
        Book a session
      </a>
    </header>
  );
}
