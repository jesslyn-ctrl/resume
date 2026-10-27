import {
  AmbientLight,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  ConeGeometry,
  DataTexture,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  PerspectiveCamera,
  RedFormat,
  Scene,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from 'three';

type MountOptions = {
  reducedMotion: boolean;
  /** Called when the cat is tapped. */
  onMeow: () => void;
};

const COLORS = {
  fur: 0xf2a65a,
  cream: 0xffe9cf,
  pink: 0xff9eb1,
  eye: 0x1f1a2e,
  white: 0xffffff,
};

/** Three-step ramp so the toon shading reads as soft cel bands. */
function toonRamp(): DataTexture {
  const ramp = new DataTexture(new Uint8Array([110, 190, 255]), 3, 1, RedFormat);
  ramp.minFilter = NearestFilter;
  ramp.magFilter = NearestFilter;
  ramp.needsUpdate = true;
  return ramp;
}

/**
 * Builds Mochi, a low-poly toon kitten, and renders her into `container`.
 * Returns a cleanup function that stops the loop and frees GPU memory.
 */
export function mountCat(container: HTMLElement, { reducedMotion, onMeow }: MountOptions): () => void {
  const size = container.clientWidth || 300;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size, size);
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Mochi, a little ginger 3D cat. Drag to spin her, tap for a meow.');
  renderer.domElement.style.touchAction = 'none';
  container.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.9, 7.2);
  camera.lookAt(0, 1.25, 0);

  scene.add(new AmbientLight(0xffffff, 1.1));
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.position.set(3, 6, 5);
  scene.add(sun);

  const ramp = toonRamp();
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const toon = (color: number) => {
    const material = new MeshToonMaterial({ color, gradientMap: ramp });
    materials.push(material);
    return material;
  };
  const mesh = (geometry: BufferGeometry, material: Material) => {
    geometries.push(geometry);
    return new Mesh(geometry, material);
  };

  const fur = toon(COLORS.fur);
  const cream = toon(COLORS.cream);
  const pink = toon(COLORS.pink);
  const eyeMat = toon(COLORS.eye);
  const shine = new MeshBasicMaterial({ color: COLORS.white });
  materials.push(shine);

  // Everything that spins and hops together.
  const cat = new Group();
  scene.add(cat);

  // Soft contact shadow on the "floor".
  const shadowMat = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.14 });
  materials.push(shadowMat);
  const shadow = mesh(new CircleGeometry(1.25, 40), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  scene.add(shadow);

  // Body: a round loaf, with a cream belly.
  const body = mesh(new SphereGeometry(1, 32, 24), fur);
  body.scale.set(1.05, 0.85, 1.3);
  body.position.y = 0.9;
  cat.add(body);
  const belly = mesh(new SphereGeometry(0.62, 24, 16), cream);
  belly.scale.set(1, 0.95, 0.6);
  belly.position.set(0, 0.78, 0.9);
  cat.add(belly);

  // Paws.
  for (const [x, z] of [
    [-0.5, 0.75],
    [0.5, 0.75],
    [-0.55, -0.7],
    [0.55, -0.7],
  ] as const) {
    const leg = mesh(new CapsuleGeometry(0.22, 0.3, 6, 12), fur);
    leg.position.set(x, 0.32, z);
    cat.add(leg);
    const paw = mesh(new SphereGeometry(0.24, 16, 12), cream);
    paw.scale.set(1, 0.55, 1.15);
    paw.position.set(x, 0.1, z + 0.06);
    cat.add(paw);
  }

  // Head (its own group so it can tilt).
  const head = new Group();
  head.position.set(0, 1.85, 0.75);
  cat.add(head);
  const skull = mesh(new SphereGeometry(0.8, 32, 24), fur);
  skull.scale.set(1.12, 0.95, 0.95);
  head.add(skull);

  for (const side of [-1, 1]) {
    const ear = mesh(new ConeGeometry(0.3, 0.55, 4), fur);
    ear.position.set(0.48 * side, 0.68, -0.05);
    ear.rotation.set(-0.1, Math.PI / 4, 0.32 * -side);
    head.add(ear);
    const inner = mesh(new ConeGeometry(0.17, 0.34, 4), pink);
    inner.position.set(0.47 * side, 0.64, 0.06);
    inner.rotation.set(-0.1, Math.PI / 4, 0.32 * -side);
    head.add(inner);

    const cheek = mesh(new SphereGeometry(0.13, 16, 12), pink);
    cheek.scale.set(1.2, 0.6, 0.4);
    cheek.position.set(0.5 * side, -0.18, 0.66);
    head.add(cheek);
  }

  // Eyes with a highlight each; scaled on Y to blink.
  const eyes: Mesh[] = [];
  for (const side of [-1, 1]) {
    const eye = mesh(new SphereGeometry(0.13, 20, 16), eyeMat);
    eye.position.set(0.3 * side, 0.05, 0.72);
    head.add(eye);
    const glint = mesh(new SphereGeometry(0.04, 10, 8), shine);
    glint.position.set(0.05, 0.05, 0.11);
    eye.add(glint);
    eyes.push(eye);
  }

  const muzzle = mesh(new SphereGeometry(0.28, 20, 16), cream);
  muzzle.scale.set(1.25, 0.8, 0.7);
  muzzle.position.set(0, -0.22, 0.68);
  head.add(muzzle);
  const nose = mesh(new SphereGeometry(0.07, 12, 10), pink);
  nose.scale.set(1.3, 0.8, 1);
  nose.position.set(0, -0.1, 0.88);
  head.add(nose);

  // Tail: a curling tube, pivoting from the rump so it can wag.
  const tail = new Group();
  tail.position.set(0, 0.95, -1.15);
  cat.add(tail);
  const tailCurve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(0, 0.45, -0.35),
    new Vector3(0.1, 1.05, -0.45),
    new Vector3(0.35, 1.45, -0.2),
    new Vector3(0.5, 1.5, 0.1),
  ]);
  const tailTube = mesh(new TubeGeometry(tailCurve, 40, 0.13, 12, false), fur);
  tail.add(tailTube);
  const tailTip = mesh(new SphereGeometry(0.15, 16, 12), cream);
  tailTip.position.copy(tailCurve.getPoint(1));
  tail.add(tailTip);

  // --- Interaction: drag to spin, tap to meow ---------------------------------
  let spin = -0.5;
  let spinVelocity = reducedMotion ? 0 : 0.25;
  let dragging = false;
  let lastX = 0;
  let moved = 0;
  let hopStart = -1;

  const canvas = renderer.domElement;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    spin += dx * 0.012;
    spinVelocity = dx * 0.6;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6) {
      hopStart = elapsed;
      onMeow();
    }
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  // --- Animation loop ----------------------------------------------------------
  const start = performance.now();
  let last = start;
  let elapsed = 0;
  let nextBlink = 1.5;
  let frame = 0;

  const render = () => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed = (now - start) / 1000;
    const t = elapsed;

    if (!dragging) {
      // Ease toward a gentle idle spin after a fling.
      const idle = reducedMotion ? 0 : 0.25;
      spinVelocity += (idle - spinVelocity) * Math.min(1, dt * 2);
      spin += spinVelocity * dt;
    }
    cat.rotation.y = spin;

    // Hop: a quick arc with a squash on landing.
    let hop = 0;
    if (hopStart >= 0) {
      const p = (t - hopStart) / 0.55;
      if (p >= 1) hopStart = -1;
      else hop = Math.sin(p * Math.PI) * 0.6;
    }
    cat.position.y = hop;
    shadow.scale.setScalar(1 - hop * 0.35);

    if (!reducedMotion) {
      body.scale.y = 0.85 + Math.sin(t * 2.2) * 0.012;
      tail.rotation.z = Math.sin(t * 3.1) * 0.35;
      head.rotation.z = Math.sin(t * 0.9) * 0.06;
    }

    // Blink every few seconds.
    if (t > nextBlink) {
      const b = (t - nextBlink) / 0.14;
      const open = b < 1 ? Math.abs(1 - b * 2) : 1;
      eyes.forEach((eye) => (eye.scale.y = Math.max(0.12, open)));
      if (b >= 1) nextBlink = t + 2.5 + Math.random() * 2.5;
    }

    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  render();

  return () => {
    cancelAnimationFrame(frame);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    ramp.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
