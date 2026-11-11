import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// The colour of the light at the back of the lens. The page uses the same
// value for the flash that the photograph develops out of.
export const LIGHT_HEX = '#efe6d8';

const FOV = 30;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const GLASS_OPACITY = 0.5;

/* ---------- small procedural textures ---------- */

function knurlTexture(repeat) {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 4;
  const g = c.getContext('2d');
  for (let x = 0; x < 32; x++) {
    const v = Math.round(255 * (0.5 + 0.5 * Math.cos((x / 32) * Math.PI * 2)));
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(x, 0, 1, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, 1);
  return t;
}

function grainTexture() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const img = g.createImageData(s, s);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + Math.random() * 130;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 3);
  return t;
}

// A dark studio to reflect: black walls and a few softboxes. Polished parts of
// the camera pick these up as long clean highlights, which is what makes a
// black object readable on a black page.
function studioEnvironment(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020202);
  const panel = (w, h, power, position, tint = 0xffffff) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(power), side: THREE.DoubleSide })
    );
    m.position.set(...position);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel(7, 3.2, 9, [0, 7, 2.5]); // overhead softbox
  panel(1.3, 8, 11, [-7, 1.5, 3.5], 0xffdfbd); // warm strip, front left
  panel(1.1, 8, 9, [7.5, 2, -3], 0xdce8ff); // cool strip, back right
  panel(4, 1.6, 2.2, [2.5, -5, 5]); // low fill
  panel(2.2, 2.2, 5, [3.5, 2.5, 7], 0xfff1df); // small front box, for the glass
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(scene, 0.035).texture;
  pmrem.dispose();
  return texture;
}

/* ---------- geometry helpers ---------- */

// A washer turned on the lens axis (Z): inner radius, outer radius, from z0 to z1.
function ring(rIn, rOut, z0, z1, bevel = 0.006, seg = 96) {
  const b = Math.min(bevel, (rOut - rIn) / 2, (z1 - z0) / 2);
  const pts = [
    [rIn, z0],
    [rOut - b, z0],
    [rOut, z0 + b],
    [rOut, z1 - b],
    [rOut - b, z1],
    [rIn, z1],
    [rIn, z0]
  ].map(([r, z]) => new THREE.Vector2(r, z));
  const g = new THREE.LatheGeometry(pts, seg);
  g.rotateX(Math.PI / 2);
  return g;
}

function profile(points, seg = 96) {
  const g = new THREE.LatheGeometry(
    points.map(([r, z]) => new THREE.Vector2(r, z)),
    seg
  );
  g.rotateX(Math.PI / 2);
  return g;
}

// A glass element: a spherical cap whose rim sits at z = rimZ.
function lensCap(capRadius, sphereRadius, rimZ, convexToFront = true) {
  const theta = Math.asin(capRadius / sphereRadius);
  const g = new THREE.SphereGeometry(sphereRadius, 64, 24, 0, Math.PI * 2, 0, theta);
  g.rotateX(convexToFront ? Math.PI / 2 : -Math.PI / 2);
  const sag = sphereRadius * Math.cos(theta);
  g.translate(0, 0, convexToFront ? rimZ - sag : rimZ + sag);
  return g;
}

// One iris blade, drawn relative to its pivot pin.
function bladeGeometry(rA, rB, pivot, span) {
  const shape = new THREE.Shape();
  const a0 = -0.24;
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((span - a0) * i) / n;
    const x = rB * Math.cos(a) - pivot;
    const y = rB * Math.sin(a);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = n; i >= 0; i--) {
    const a = a0 + ((span - a0) * i) / n;
    shape.lineTo(rA * Math.cos(a) - pivot, rA * Math.sin(a));
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

/* ---------- the camera ---------- */

function buildCamera() {
  const root = new THREE.Group();
  const grain = grainTexture();

  const leather = new THREE.MeshStandardMaterial({
    color: 0x0d0d0d,
    roughness: 0.62,
    metalness: 0.1,
    bumpMap: grain,
    bumpScale: 2.2
  });
  const plate = new THREE.MeshStandardMaterial({ color: 0x151516, roughness: 0.3, metalness: 0.92 });
  const satin = new THREE.MeshStandardMaterial({
    color: 0x131314,
    roughness: 0.32,
    metalness: 0.9,
    side: THREE.DoubleSide
  });
  const silver = new THREE.MeshStandardMaterial({
    color: 0x8d8a84,
    roughness: 0.3,
    metalness: 1,
    side: THREE.DoubleSide
  });
  const bronze = new THREE.MeshStandardMaterial({
    color: 0xa08672,
    roughness: 0.28,
    metalness: 1,
    side: THREE.DoubleSide
  });
  const rubberFine = new THREE.MeshStandardMaterial({
    color: 0x101010,
    roughness: 0.92,
    metalness: 0,
    bumpMap: knurlTexture(150),
    bumpScale: 3,
    side: THREE.DoubleSide
  });
  const rubberWide = new THREE.MeshStandardMaterial({
    color: 0x101010,
    roughness: 0.92,
    metalness: 0,
    bumpMap: knurlTexture(64),
    bumpScale: 4,
    side: THREE.DoubleSide
  });
  const dial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2c,
    roughness: 0.36,
    metalness: 0.95,
    bumpMap: knurlTexture(48),
    bumpScale: 3
  });
  const matte = new THREE.MeshStandardMaterial({
    color: 0x070707,
    roughness: 0.96,
    metalness: 0,
    side: THREE.DoubleSide
  });
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x3a3733,
    roughness: 0.44,
    metalness: 0.95,
    side: THREE.DoubleSide
  });
  const screen = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.08, metalness: 0.2 });

  const glassMats = [];
  const glass = (tint, thickness) => {
    const m = new THREE.MeshPhysicalMaterial({
      color: tint,
      roughness: 0.03,
      metalness: 0,
      transparent: true,
      opacity: GLASS_OPACITY,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      iridescence: 1,
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: thickness,
      envMapIntensity: 2.2,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    glassMats.push(m);
    return m;
  };

  const add = (geometry, material, x = 0, y = 0, z = 0, parent = root) => {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  /* body: the group origin is the lens axis, so the body sits a little off-centre */
  const body = new THREE.Group();
  body.position.set(-0.1, 0.02, 0);
  root.add(body);

  add(new RoundedBoxGeometry(1.5, 0.84, 0.55, 6, 0.07), leather, 0, 0, 0, body);
  add(new RoundedBoxGeometry(1.52, 0.15, 0.57, 6, 0.05), plate, 0, 0.455, 0, body);
  add(new RoundedBoxGeometry(1.52, 0.07, 0.57, 6, 0.03), plate, 0, -0.44, 0, body);
  add(new RoundedBoxGeometry(0.36, 0.86, 0.4, 6, 0.13), leather, -0.6, -0.01, 0.2, body); // grip
  add(new RoundedBoxGeometry(0.58, 0.3, 0.5, 6, 0.09), plate, 0.1, 0.6, -0.01, body); // prism hump
  add(new THREE.BoxGeometry(0.2, 0.024, 0.22), silver, 0.1, 0.762, -0.06, body); // hot shoe
  add(new RoundedBoxGeometry(0.86, 0.56, 0.03, 4, 0.012), screen, 0.12, -0.05, -0.278, body); // rear screen
  add(new RoundedBoxGeometry(0.3, 0.2, 0.1, 4, 0.04), matte, 0.1, 0.57, -0.29, body); // eyepiece

  const upright = (radius, height, material, x, y, z) =>
    add(new THREE.CylinderGeometry(radius, radius, height, 64), material, x, y, z, body);
  upright(0.135, 0.085, dial, 0.55, 0.57, -0.03); // mode dial
  upright(0.1, 0.012, silver, 0.55, 0.619, -0.03);
  upright(0.095, 0.06, dial, -0.33, 0.56, -0.13); // rear dial
  upright(0.075, 0.03, plate, -0.6, 0.545, 0.27); // shutter collar
  upright(0.052, 0.04, bronze, -0.6, 0.565, 0.27); // shutter button

  // strap lugs, a focus lamp and one bronze dot on the front
  for (const side of [-1, 1]) {
    const lug = add(new THREE.TorusGeometry(0.045, 0.012, 12, 32), silver, side * 0.775, 0.33, 0, body);
    lug.rotation.y = Math.PI / 2;
  }
  const lamp = add(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 32), screen, -0.33, 0.27, 0.278, body);
  lamp.rotation.x = Math.PI / 2;
  const dot = add(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 24), bronze, 0.6, 0.27, 0.278, body);
  dot.rotation.x = Math.PI / 2;
  add(new RoundedBoxGeometry(0.2, 0.62, 0.03, 4, 0.012), plate, -0.6, -0.03, 0.4, body); // grip inlay

  const release = add(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 32), plate, 0.62, -0.1, 0.285, body);
  release.rotation.x = Math.PI / 2;

  /* lens barrel: every part shares the same bore so the inside reads as one tube */
  const BORE = 0.3;
  add(ring(BORE, 0.415, 0.262, 0.302), silver); // mount
  add(ring(BORE, 0.375, 0.302, 0.5), satin);
  add(ring(BORE, 0.382, 0.5, 0.516, 0.003), bronze); // the one bronze line
  add(ring(BORE, 0.398, 0.516, 0.8), rubberFine); // focus ring
  add(ring(BORE, 0.383, 0.8, 0.92), satin);
  add(ring(BORE, 0.412, 0.92, 1.28), rubberWide); // zoom ring
  add(ring(BORE, 0.398, 1.28, 1.42), satin);
  add(
    profile([
      [BORE, 1.42],
      [0.402, 1.42],
      [0.43, 1.455],
      [0.43, 1.52],
      [0.4, 1.52],
      [0.372, 1.475],
      [0.312, 1.45],
      [BORE, 1.42]
    ]),
    satin
  );

  /* inside: holders, baffles, glass */
  add(ring(0.262, BORE + 0.004, 1.395, 1.425), matte);
  add(lensCap(0.266, 0.52, 1.405), glass(0x0b0f12, [420, 620]));
  add(ring(0.232, BORE + 0.004, 1.13, 1.16), matte);
  add(lensCap(0.236, 0.7, 1.145), glass(0x100d0a, [380, 640]));
  add(ring(0.25, BORE + 0.004, 1.0, 1.012), matte);
  add(ring(0.18, BORE + 0.004, 0.872, 0.888), matte); // iris housing, front
  add(ring(0.18, BORE + 0.004, 0.8, 0.816), matte); // iris housing, back
  add(ring(0.205, BORE + 0.004, 0.68, 0.692), matte);
  add(ring(0.2, BORE + 0.004, 0.56, 0.59), matte);
  add(lensCap(0.204, 0.6, 0.575, false), glass(0x0b0f12, [300, 560]));
  add(ring(0.24, BORE + 0.004, 0.44, 0.452), matte);

  /* iris: nine blades, each turning on a pin at the edge of the housing */
  const BLADES = 9;
  const PIVOT = 0.272;
  const pivots = [];
  const bladeGeo = bladeGeometry(0.186, 0.296, PIVOT, ((Math.PI * 2) / BLADES) * 2.5);
  for (let i = 0; i < BLADES; i++) {
    const holder = new THREE.Group();
    holder.rotation.z = (i / BLADES) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.position.set(PIVOT, 0, 0.836 + i * 0.0016);
    pivot.add(new THREE.Mesh(bladeGeo, bladeMat));
    holder.add(pivot);
    root.add(holder);
    pivots.push(pivot);
  }

  /* the light at the back of the lens */
  const lightMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
  add(new THREE.CircleGeometry(BORE + 0.01, 64), lightMat, 0, 0, 0.33);
  const glow = new THREE.PointLight(0xffe9cf, 0, 2.4, 1.6);
  glow.position.set(0, 0, 0.42);
  root.add(glow);

  return { root, pivots, glassMats, lightMat, glow };
}

/* ---------- the stage ---------- */

const basePose = () => ({
  x: 0,
  y: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  camZ: 7,
  fov: FOV,
  aperture: 0.36,
  glass: 1,
  light: 0,
  loose: 1,
  alpha: 1
});

export class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.environment = studioEnvironment(this.renderer);
    this.scene.environmentIntensity = 1;

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 60);

    const key = new THREE.SpotLight(0xffe6cc, 90, 30, 0.5, 0.7, 1.6);
    key.position.set(-4.5, 5, 6);
    this.scene.add(key, key.target);
    const rim = new THREE.DirectionalLight(0xdfe8ff, 1.6);
    rim.position.set(5, 2.5, -4);
    this.scene.add(rim);
    const kick = new THREE.DirectionalLight(0xffd9b0, 0.5);
    kick.position.set(3, -2, 3);
    this.scene.add(kick);

    this.model = buildCamera();
    this.rig = new THREE.Group();
    this.rig.add(this.model.root);
    this.scene.add(this.rig);

    this.dark = new THREE.Color(0x030303);
    this.lit = new THREE.Color(LIGHT_HEX);

    // Two independent sets of values: the dive timeline owns one, the
    // sessions section owns the other. `mode` says which one is on screen.
    this.dive = basePose();
    this.pose = { ...basePose(), alpha: 0 };
    this.mode = 'dive';
    this.still = false;
    // The entrance on load: an extra turn and a fade that the page tweens to rest.
    this.entrance = { turn: 0, fade: 1 };
    // How far (in world units) the sessions camera is carried up or down, so
    // that it arrives and leaves with its section instead of fading over others.
    this.lift = 0;

    this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    this.onPointer = e => {
      this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', this.onPointer, { passive: true });

    this.resize = this.resize.bind(this);
    this.frame = this.frame.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
    this.clock = new THREE.Clock();
    this.raf = requestAnimationFrame(this.frame);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.aspect = w / h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  // How far back the camera must stand, and how much world it then sees.
  metrics() {
    const portrait = this.aspect < 1; // matches the (orientation: portrait) rules in styles.css
    const heroZ = Math.max(5.7, 3.15 / (2 * TAN * this.aspect));
    const visH = 2 * TAN * heroZ;
    return { portrait, heroZ, visH, visW: visH * this.aspect };
  }

  // Carry the sessions camera by a distance given in screen pixels.
  setLift(pixels) {
    this.lift = (pixels / window.innerHeight) * 2 * TAN * this.pose.camZ;
  }

  heroPose() {
    const { portrait, heroZ, visH } = this.metrics();
    return { x: portrait ? -0.2 : 0.04, y: visH * (portrait ? 0.075 : 0.15), rx: 0.17, ry: 0.66, rz: 0, camZ: heroZ };
  }

  sessionPose(i) {
    const { portrait, heroZ, visH, visW } = this.metrics();
    const camZ = portrait ? heroZ * 1.12 : heroZ * 1.02;
    const x = portrait ? 0 : visW * 0.24;
    const y = portrait ? visH * 0.105 : -visH * 0.02;
    const looks = [
      { rx: 0.05, ry: -0.3, rz: 0, aperture: 0.02 }, // portraits: wide open, facing you
      { rx: 0.14, ry: -0.86, rz: 0, aperture: 0.2 }, // couples: three-quarter
      { rx: 0.44, ry: 0.5, rz: 0.03, aperture: 0.32 }, // families: the other side, from above
      { rx: 0.03, ry: 0.14, rz: 0, aperture: 0.54 } // guesthouses: stopped right down
    ];
    const look = looks[i];
    // keep the long lens inside the frame whichever way it points
    const shift = -Math.sin(look.ry) * (portrait ? 0.5 : 0.62);
    return { x: x + shift, y, camZ, fov: FOV, glass: 0.36, light: 0.42, loose: 1, ...look };
  }

  frame() {
    this.raf = requestAnimationFrame(this.frame);
    const s = this.mode === 'dive' ? this.dive : this.pose;
    const visible = s.alpha > 0.004;
    const style = this.canvas.style;
    const vis = visible ? 'visible' : 'hidden';
    if (style.visibility !== vis) style.visibility = vis;
    if (!visible || document.hidden) return;
    style.opacity = s.alpha * this.entrance.fade;

    const t = this.clock.getElapsedTime();
    const p = this.pointer;
    p.x += (p.tx - p.x) * 0.05;
    p.y += (p.ty - p.y) * 0.05;
    const loose = this.still ? 0 : s.loose;

    const lift = this.mode === 'sessions' ? this.lift : 0;
    this.rig.position.set(s.x, s.y + lift + Math.sin(t * 0.7) * 0.035 * loose, 0);
    this.rig.rotation.set(
      s.rx + (p.y * 0.07 + Math.sin(t * 0.5) * 0.015) * loose,
      s.ry + this.entrance.turn + (p.x * 0.16 + Math.sin(t * 0.33) * 0.03) * loose,
      s.rz
    );

    this.camera.position.set(0, 0, s.camZ);
    if (this.camera.fov !== s.fov) {
      this.camera.fov = s.fov;
      this.camera.updateProjectionMatrix();
    }

    const m = this.model;
    for (const pivot of m.pivots) pivot.rotation.z = s.aperture;
    for (const g of m.glassMats) {
      g.opacity = GLASS_OPACITY * s.glass;
      g.visible = g.opacity > 0.01;
    }
    m.lightMat.color.copy(this.dark).lerp(this.lit, s.light);
    m.glow.intensity = s.light * 5;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    this.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        for (const k of ['map', 'bumpMap']) o.material[k]?.dispose?.();
        o.material.dispose();
      }
    });
    this.scene.environment?.dispose?.();
    this.renderer.dispose();
  }
}
