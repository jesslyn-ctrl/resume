/**
 * Easter egg: tap the name (header or home hero) five times quickly, or type "meow",
 * and Mochi the 3D cat pops up. three.js loads only when the egg is found.
 */

const TAPS_NEEDED = 5;
const TAP_WINDOW_MS = 700;
const SECRET_WORD = 'meow';
const MEOWS = ['meow!', 'mrrp?', 'nya~', 'purrr…', 'MEOW!'];

let taps = 0;
let lastTap = 0;
let typed = '';
let dialog: HTMLDialogElement | null = null;
let cleanup: (() => void) | null = null;

function buildDialog(): HTMLDialogElement {
  const el = document.createElement('dialog');
  el.className = 'egg';
  el.setAttribute('aria-labelledby', 'egg-title');
  el.innerHTML = `
    <button class="egg-close" type="button" aria-label="Close">×</button>
    <p class="egg-kicker">You found an easter egg</p>
    <h2 id="egg-title" class="egg-title">Meet Mochi</h2>
    <div class="egg-stage">
      <div class="egg-cat" data-egg-cat></div>
      <p class="egg-bubble" data-egg-bubble aria-live="polite"></p>
    </div>
    <p class="egg-hint">Drag to spin her. Tap her for a meow.</p>
  `;
  el.querySelector('.egg-close')!.addEventListener('click', closeEgg);
  // Clicking the backdrop (the dialog element itself, outside the card) closes it.
  el.addEventListener('click', (event) => {
    if (event.target === el) closeEgg();
  });
  // Esc fires "cancel" right away; "close" is a fallback (browsers may delay it in background tabs).
  el.addEventListener('cancel', stopCat);
  el.addEventListener('close', stopCat);
  document.body.append(el);
  return el;
}

/** Stops the render loop and frees the GPU. Safe to call more than once. */
function stopCat(): void {
  cleanup?.();
  cleanup = null;
}

function closeEgg(): void {
  stopCat();
  if (dialog?.open) dialog.close();
}

async function openEgg(): Promise<void> {
  if (dialog?.open) return;
  dialog ??= buildDialog();
  // Page transitions swap <body>; re-attach if the dialog was dropped.
  if (!dialog.isConnected) document.body.append(dialog);

  const stage = dialog.querySelector<HTMLElement>('[data-egg-cat]')!;
  const bubble = dialog.querySelector<HTMLElement>('[data-egg-bubble]')!;
  stage.replaceChildren();
  bubble.textContent = '';
  dialog.showModal();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let bubbleTimer = 0;
  const meow = () => {
    bubble.textContent = MEOWS[Math.floor(Math.random() * MEOWS.length)];
    bubble.classList.remove('is-popping');
    void bubble.offsetWidth; // restart the pop animation
    bubble.classList.add('is-popping');
    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(() => (bubble.textContent = ''), 1400);
  };

  try {
    const { mountCat } = await import('./cat3d');
    if (!dialog.open) return;
    const unmount = mountCat(stage, { reducedMotion, onMeow: meow });
    cleanup = () => {
      window.clearTimeout(bubbleTimer);
      unmount();
    };
    meow();
  } catch {
    // No WebGL (or the chunk failed to load): still give them a cat.
    stage.innerHTML = '<p class="egg-fallback">ฅ^•ﻌ•^ฅ<br />Mochi is shy without 3D graphics.</p>';
  }
}

function onClick(event: MouseEvent): void {
  // The name in the header, or the big name on the home page.
  // Events can target the document or a text node, which have no closest().
  if (!(event.target instanceof Element)) return;
  const target = event.target.closest<HTMLElement>('.site-header .brand, .hero h1');
  if (!target) return;

  const now = performance.now();
  taps = now - lastTap < TAP_WINDOW_MS ? taps + 1 : 1;
  lastTap = now;

  // The header name links home. Already home? Don't reload the page (its swap would close the egg).
  // Elsewhere the first tap navigates home as usual and quick follow-up taps stay put.
  if (target instanceof HTMLAnchorElement) {
    const alreadyThere = new URL(target.href).pathname === location.pathname;
    if (alreadyThere || taps > 1) event.preventDefault();
  }
  if (taps >= TAPS_NEEDED) {
    taps = 0;
    openEgg();
  }
}

function onKey(event: KeyboardEvent): void {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
  typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
  if (typed === SECRET_WORD) {
    typed = '';
    openEgg();
  }
}

// Registered once on the document, so they survive client-side page transitions.
// Capture phase: run before Astro's router handles the link, so preventDefault is respected.
document.addEventListener('click', onClick, { capture: true });
document.addEventListener('keydown', onKey);
document.addEventListener('astro:before-swap', closeEgg);

console.info('%cฅ^•ﻌ•^ฅ  psst… try typing "meow"', 'color:#f2a65a;font-weight:bold;font-size:13px');
