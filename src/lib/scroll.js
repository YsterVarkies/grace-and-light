import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// All scroll choreography for the page. `stage` is the WebGL camera (or null
// when WebGL is unavailable); `reduce` is the visitor's reduced-motion setting.
export function buildScroll(stage, reduce) {
  const D = stage?.dive;
  const hero = () => stage.heroPose();

  if (stage) {
    Object.assign(D, hero());
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

    tl.to('.hero__meta', { autoAlpha: 0, y: -24, duration: 0.07 }, 0.01)
      .to('.hero__script', { autoAlpha: 0, y: -16, duration: 0.07 }, 0.01)
      .to('.hero__name', { yPercent: 16, autoAlpha: 0, duration: 0.17, ease: 'power1.in' }, 0.05);

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
        { scale: 1.12, filter: 'brightness(1.9) saturate(0.5)' },
        { scale: 1, filter: 'brightness(1) saturate(1)', duration: 0.2, ease: 'power2.out' },
        0.75
      )
      .to('.flash', { autoAlpha: 0, duration: 0.13, ease: 'power1.out' }, 0.755)
      .from('.reveal__line span', { yPercent: 115, duration: 0.09, stagger: 0.03, ease: 'power3.out' }, 0.84)
      .from('.reveal__note', { autoAlpha: 0, y: 16, duration: 0.05 }, 0.92)
      .to({}, { duration: 0.03 }, 0.97);
  }

  if (reduce) return () => {};

  /* ---- entrances: the parts of each section arrive one after another ---- */
  gsap.utils.toArray('[data-rise]').forEach(group => {
    const items = group.dataset.rise === 'self' ? [group] : Array.from(group.children);
    gsap.from(items, {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 92%', once: true }
    });
  });

  /* ---- the portfolio's photographs rise in as they arrive ---- */
  ScrollTrigger.batch('.shot', {
    start: 'top 94%',
    once: true,
    onEnter: batch => gsap.from(batch, { y: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 })
  });

  /* ---- photographs drift slowly inside their frames ---- */
  gsap.utils.toArray('[data-drift]').forEach(img => {
    gsap.fromTo(
      img,
      { scale: 1.14, yPercent: -3 },
      {
        scale: 1.02,
        yPercent: 3,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });

  return () => {};
}

// The load entrance of the first screen.
export function playEntrance(stage, reduce) {
  if (reduce) return;
  if (stage) {
    gsap.fromTo(stage.entrance, { fade: 0 }, { fade: 1, duration: 1.6, ease: 'power2.out', delay: 0.15 });
    gsap.fromTo(stage.entrance, { turn: -0.9 }, { turn: 0, duration: 2.6, ease: 'power3.out', delay: 0.1 });
  }
  gsap.from('.hero__script', { y: 18, autoAlpha: 0, duration: 1, ease: 'power3.out', delay: 0.5 });
  gsap.from('.hero__meta > *', { y: 22, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.35 });
  gsap.from('.nav', { y: -18, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 });
}
