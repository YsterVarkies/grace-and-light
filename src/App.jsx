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
      lenis = new Lenis({ lerp: 0.11, anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      tick = time => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

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
