import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// All scroll choreography for the page. `stage` is the WebGL camera (or null
// when WebGL is unavailable); `reduce` is the visitor's reduced-motion setting.
export function buildScroll(stage, reduce, lenis) {
  const D = stage?.dive;
  const P = stage?.pose;
  const hero = () => stage.heroPose();
  const cleanups = [];
  const done = () => cleanups.forEach(fn => fn());

  if (stage) {
    Object.assign(D, hero());
    Object.assign(P, stage.sessionPose(0));
    stage.still = reduce;
  }

  /* ---- the dive: hero -> through the lens -> the photograph ---- */
  if (reduce) {
    // No pin, no travel: the hero and the photograph are two ordinary screens.
    if (stage) {
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 60%',
        onToggle: self => {
          D.alpha = self.isActive ? 1 : 0;
        }
      });
    }
  } else {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.dive',
        start: 'top top',
        end: '+=420%',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    tl.to('.hero__meta', { autoAlpha: 0, y: -24, duration: 0.07 }, 0.01).to(
      '.hero__name',
      { yPercent: 16, autoAlpha: 0, duration: 0.17, ease: 'power1.in' },
      0.05
    );

    if (stage) {
      tl.fromTo(
        D,
        { x: () => hero().x, y: () => hero().y, rx: () => hero().rx, ry: () => hero().ry, loose: 1 },
        { x: 0, y: 0, rx: 0, ry: 0, loose: 0, duration: 0.25, ease: 'power2.inOut' },
        0
      )
        .fromTo(D, { camZ: () => hero().camZ }, { camZ: 2.3, duration: 0.44, ease: 'power2.in' }, 0.1)
        .fromTo(D, { light: 0 }, { light: 1, duration: 0.26 }, 0.32)
        .fromTo(D, { aperture: 0.36 }, { aperture: 0.46, duration: 0.2, ease: 'power1.inOut' }, 0.28)
        .to(D, { aperture: 0, duration: 0.17, ease: 'power2.inOut' }, 0.5)
        .fromTo(D, { glass: 1 }, { glass: 0, duration: 0.12 }, 0.43)
        .fromTo(D, { fov: 30 }, { fov: 44, duration: 0.2 }, 0.54)
        .to(D, { camZ: 0.47, duration: 0.2 }, 0.54)
        .set(D, { alpha: 0 }, 0.75);
    }

    tl.set('.flash', { autoAlpha: 1 }, 0.74)
      .set('.reveal', { autoAlpha: 1 }, 0.74)
      .fromTo(
        '.reveal__img',
        { scale: 1.12, filter: 'brightness(2.6) saturate(0.5)' },
        { scale: 1, filter: 'brightness(1) saturate(1)', duration: 0.2, ease: 'power2.out' },
        0.75
      )
      .to('.flash', { autoAlpha: 0, duration: 0.13, ease: 'power1.out' }, 0.755)
      .from('.reveal__line span', { yPercent: 115, duration: 0.09, stagger: 0.03, ease: 'power3.out' }, 0.84)
      .from('.reveal__note', { autoAlpha: 0, y: 16, duration: 0.05 }, 0.92)
      .to({}, { duration: 0.03 }, 0.97);
  }

  /* ---- sessions: one pinned screen; the camera turns as the words change ---- */
  const articles = gsap.utils.toArray('.session');
  const tabs = gsap.utils.toArray('.tabs button');
  const stack = document.querySelector('.sessions__stack');
  let active = 0;

  const poseFor = i => {
    const { alpha, ...pose } = { alpha: 0, ...stage.sessionPose(i) };
    return pose;
  };
  const markTab = i =>
    tabs.forEach((t, n) => (n === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));

  const show = i => {
    if (i === active) return;
    const from = articles[active];
    const to = articles[i];
    const down = i > active;
    active = i;
    markTab(i);
    gsap.killTweensOf([...articles, ...articles.flatMap(el => Array.from(el.children))]);
    articles.forEach(el => el !== to && el !== from && el.remove());
    gsap.to(from, {
      autoAlpha: 0,
      y: down ? -18 : 18,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (articles[active] !== from) from.remove();
      }
    });
    stack.appendChild(to);
    gsap.set(to, { autoAlpha: 1, y: 0 });
    gsap.fromTo(
      to.children,
      { autoAlpha: 0, y: down ? 30 : -30 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, delay: 0.22 }
    );
    if (stage) gsap.to(P, { ...poseFor(i), duration: 1.5, ease: 'power3.inOut', overwrite: 'auto' });
  };

  let pin = null;
  if (!reduce) {
    // Only the session on show is in the document; the others wait off-stage.
    articles.slice(1).forEach(el => el.remove());
    cleanups.push(() => articles.forEach(el => stack.appendChild(el)));
    pin = ScrollTrigger.create({
      trigger: '.sessions__panel',
      start: 'top top',
      end: '+=260%',
      pin: true,
      anticipatePin: 1,
      onUpdate: self => show(Math.min(articles.length - 1, Math.floor(self.progress * articles.length)))
    });

    const jump = e => {
      const i = Number(e.currentTarget.dataset.step);
      const y = pin.start + ((i + 0.5) / articles.length) * (pin.end - pin.start);
      if (lenis) lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    tabs.forEach(t => t.addEventListener('click', jump));
    cleanups.push(() => tabs.forEach(t => t.removeEventListener('click', jump)));
  }

  if (stage) {
    const narrow = () => stage.metrics().portrait;
    const ride = () => {
      if (!pin) return stage.setLift(0);
      const y = window.scrollY;
      // below its pinned place while the panel arrives, above it once the panel leaves
      stage.setLift(y < pin.start ? y - pin.start : y > pin.end ? y - pin.end : 0);
    };

    ScrollTrigger.create({
      trigger: '.sessions',
      start: () => (pin ? pin.start - window.innerHeight : 'top 45%'),
      end: () => (pin ? pin.end + window.innerHeight : 'bottom 55%'),
      onUpdate: ride,
      onRefresh: ride,
      onToggle: self => {
        // In reduced motion the sessions stack as plain text; on a phone the
        // camera would sit over them, so it stays away there.
        if (reduce && narrow()) return;
        ride();
        if (self.isActive) {
          stage.mode = 'sessions';
          gsap.to(P, { alpha: 1, duration: 0.25, overwrite: 'auto' });
        } else {
          const leavingUp = self.direction < 0;
          gsap.to(P, {
            alpha: 0,
            duration: 0.2,
            overwrite: 'auto',
            onComplete: () => {
              if (leavingUp) stage.mode = 'dive';
            }
          });
        }
      }
    });

    ScrollTrigger.addEventListener('refreshInit', () => Object.assign(P, poseFor(active)));
  }

  if (reduce) return done;

  /* ---- entrances: the parts of each section arrive one after another ---- */
  gsap.utils.toArray('[data-rise]').forEach(group => {
    const items = group.dataset.rise === 'self' ? [group] : Array.from(group.children);
    gsap.from(items, {
      y: 28,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: group, start: 'top 94%', once: true }
    });
  });

  /* ---- photographs drift slowly inside their frames ---- */
  gsap.utils.toArray('[data-drift]').forEach(img => {
    gsap.fromTo(
      img,
      { scale: 1.16, yPercent: -3 },
      {
        scale: 1.04,
        yPercent: 3,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });

  return done;
}

// The load entrance of the first screen.
export function playEntrance(stage, reduce) {
  if (reduce) return;
  if (stage) {
    gsap.fromTo(stage.entrance, { fade: 0 }, { fade: 1, duration: 1.6, ease: 'power2.out', delay: 0.15 });
    gsap.fromTo(stage.entrance, { turn: -0.9 }, { turn: 0, duration: 2.6, ease: 'power3.out', delay: 0.1 });
  }
  gsap.from('.hero__meta > *', { y: 22, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.35 });
  gsap.from('.nav', { y: -18, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 });
}
