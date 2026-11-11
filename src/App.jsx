import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Stage } from './three/stage.js';
import { buildScroll, playEntrance } from './lib/scroll.js';
import Nav from './components/Nav.jsx';
import Dive from './components/Dive.jsx';
import Portfolio from './components/Portfolio.jsx';
import Sessions from './components/Sessions.jsx';
import HowWeWork from './components/HowWeWork.jsx';
import Light from './components/Light.jsx';
import Book from './components/Book.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.toggle('reduced', reduce);

    let stage = null;
    try {
      stage = new Stage(canvasRef.current);
    } catch {
      root.classList.add('no-webgl');
    }

    // Smooth scrolling, driven by the same clock as the scroll animations.
    let lenis = null;
    let tick = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.11 });
      lenis.on('scroll', ScrollTrigger.update);
      tick = time => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // A link to a part of the page first flies through the camera lens, at a
    // pace you can watch, and then glides on to the section you chose. (From
    // below the dive it simply glides.)
    const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const onLinkClick = e => {
      const link = e.target.closest?.('a[href^="#"]');
      const id = link?.getAttribute('href');
      if (!lenis || !id || id.length < 2 || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, '', id);

      const done = () => document.querySelector('.nav')?.classList.remove('is-away');
      if (id === '#top') {
        lenis.scrollTo(0, { duration: Math.min(4, 1 + window.scrollY / 2500), easing: easeInOut, onComplete: done });
        return;
      }

      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const glide = (again = true) => {
        const distance = Math.abs(target.getBoundingClientRect().top - margin);
        // (Lenis already allows for the section's scroll-margin-top)
        lenis.scrollTo(target, {
          duration: again ? Math.min(5, 1 + distance / 1800) : 0.5,
          easing: easeInOut,
          onComplete: () => {
            // the page can settle a little while it moves (images, the dive
            // letting go), so check once more that we are exactly there
            if (again && Math.abs(target.getBoundingClientRect().top - margin) > 3) glide(false);
            else done();
          }
        });
      };

      const dive = ScrollTrigger.getAll().find(s => s.vars.trigger === '.dive');
      const diveEnd = dive ? dive.end : 0;
      if (dive && window.scrollY < diveEnd - 40) {
        // through the lens: the whole dive takes a few seconds, then on to the section
        const left = diveEnd - window.scrollY;
        lenis.scrollTo(diveEnd, {
          duration: Math.min(4.8, 0.8 + left / 1100),
          easing: t => t * (2 - t) * 0.35 + t * 0.65, // steady, easing out gently at the photograph
          onComplete: () => setTimeout(glide, 350)
        });
      } else {
        glide();
      }
    };
    document.addEventListener('click', onLinkClick);

    let undo = () => {};
    const ctx = gsap.context(() => {
      undo = buildScroll(stage, reduce, lenis);
      playEntrance(stage, reduce);
    });

    // The bar steps aside while you scroll down and returns when you scroll up.
    const nav = document.querySelector('.nav');
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80 || y < lastY - 6) nav.classList.remove('is-away');
      else if (y > lastY + 6) nav.classList.add('is-away');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Fonts change the height of the page; measure again once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onLinkClick);
      undo();
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      stage?.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="stage" aria-hidden="true" />
      <Nav />
      <main>
        <Dive />
        <Sessions />
        <Portfolio />
        <HowWeWork />
        <Light />
        <Book />
      </main>
      <Footer />
    </>
  );
}
