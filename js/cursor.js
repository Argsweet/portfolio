/* ============================================================================
   cursor.js — the custom cursor: a gold diamond, a ring that trails behind it,
   a few sparks while you move, and a burst when you click.

   Three rules keep this from becoming the kind of cursor effect that makes a
   site feel cheap:

     1. Sparks are emitted by DISTANCE, not by time. Emitting per frame gives
        you a dense comet tail; emitting every ~30px means fast movement makes
        a short trail of well-spaced sparks and slow movement makes almost
        none. That is what "minimal, only when moving" actually requires.
     2. There is one rAF loop for everything, and it only writes `transform`
        and `opacity` — the two properties the browser can animate without
        recalculating layout.
     3. It turns itself off where it would be wrong: touch screens (no cursor
        to replace) and reduced-motion (the native cursor comes back).

   The colors come from --accent / --accent-2, so the cursor re-tints itself
   with whichever card is active, like everything else on the site.
   ========================================================================== */

const STEP = 30;         // px of travel between sparks
const MAX_SPARKS = 14;   // hard cap on live particles
const RING_EASE = 0.18;  // how hard the ring chases the dot (0-1)

const HOVERABLE = 'a, button, [role="button"], .node, .tab, .gal-card, .chips li';

export function initCursor() {
  // a cursor replacement only makes sense for a real pointer
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduced) return;

  const root = document.createElement("div");
  root.className = "cursor";
  root.setAttribute("aria-hidden", "true");
  // The resting state is an arrow, because a bare dot gives you nothing to
  // point WITH — the tip is the whole affordance of a cursor. Over something
  // clickable it hands off to the diamond + ring, which is a target rather
  // than a pointer. The arrow's tip sits exactly on the pointer coordinate,
  // so it is the one part that gets no -50% centering.
  root.innerHTML = `
    <span class="cursor__ring"></span>
    <span class="cursor__dot"></span>
    <svg class="cursor__arrow" viewBox="0 0 15 20" width="15" height="20">
      <path d="M0 0 L0 17 L4.4 12.9 L7.3 19 L10.2 17.6 L7.2 11.6 L13.2 11.4 Z"
            fill="var(--accent-2, #f3cf7a)"
            stroke="rgba(6, 4, 16, 0.75)" stroke-width="1" stroke-linejoin="round"/>
    </svg>`;

  const fx = document.createElement("div");
  fx.className = "cursor-fx";
  fx.setAttribute("aria-hidden", "true");

  document.body.append(fx, root);
  document.documentElement.classList.add("has-custom-cursor");

  const dot = root.querySelector(".cursor__dot");
  const ring = root.querySelector(".cursor__ring");
  const arrow = root.querySelector(".cursor__arrow");

  let x = innerWidth / 2, y = innerHeight / 2;   // where the pointer is
  let rx = x, ry = y;                            // where the ring has got to
  let lastSparkX = x, lastSparkY = y;
  let moved = false;
  const sparks = [];

  /* --- particles ---------------------------------------------------------
     Each spark is a short-lived element that animates itself in CSS and is
     removed on animationend, so no timer bookkeeping and nothing accumulates
     if the tab is backgrounded mid-animation. */
  function spawnSpark(px, py, opts = {}) {
    if (sparks.length >= MAX_SPARKS) sparks.shift()?.remove();

    const s = document.createElement("span");
    s.className = "spark";
    const angle = opts.angle ?? Math.random() * Math.PI * 2;
    const dist = opts.dist ?? 6 + Math.random() * 10;
    s.style.setProperty("--x", `${px}px`);
    s.style.setProperty("--y", `${py}px`);
    s.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    s.style.setProperty("--dy", `${Math.sin(angle) * dist - 4}px`);   // drifts up
    s.style.setProperty("--size", `${opts.size ?? 3 + Math.random() * 2}px`);
    s.style.setProperty("--life", `${opts.life ?? 620 + Math.random() * 240}ms`);
    if (opts.gold) s.classList.add("spark--gold");

    s.addEventListener("animationend", () => {
      s.remove();
      const i = sparks.indexOf(s);
      if (i > -1) sparks.splice(i, 1);
    });
    fx.append(s);
    sparks.push(s);
  }

  /* --- pointer ----------------------------------------------------------- */
  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    x = e.clientX;
    y = e.clientY;
    if (!moved) { rx = x; ry = y; moved = true; root.classList.add("is-live"); }

    // emit by distance travelled, not per frame — see rule 1 up top
    const dx = x - lastSparkX, dy = y - lastSparkY;
    if (Math.hypot(dx, dy) > STEP) {
      spawnSpark(x, y, { gold: Math.random() > 0.45 });
      lastSparkX = x;
      lastSparkY = y;
    }
  }, { passive: true });

  addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    root.classList.add("is-down");

    // ripple + a small radial burst
    const r = document.createElement("span");
    r.className = "ripple";
    r.style.setProperty("--x", `${e.clientX}px`);
    r.style.setProperty("--y", `${e.clientY}px`);
    r.addEventListener("animationend", () => r.remove());
    fx.append(r);

    for (let i = 0; i < 6; i++) {
      spawnSpark(e.clientX, e.clientY, {
        angle: (i / 6) * Math.PI * 2 + Math.random() * 0.4,
        dist: 22 + Math.random() * 14,
        life: 520,
        gold: i % 2 === 0,
      });
    }
  });

  addEventListener("pointerup", () => root.classList.remove("is-down"));

  // grow over anything clickable. One delegated listener rather than one per
  // element, so it keeps working through every re-render.
  addEventListener("pointerover", (e) => {
    root.classList.toggle("is-hover", !!e.target.closest?.(HOVERABLE));
  }, { passive: true });

  // the cursor should not linger after the pointer leaves the window
  addEventListener("pointerleave", () => root.classList.remove("is-live"));
  addEventListener("pointerenter", () => root.classList.add("is-live"));

  /* --- one loop for everything ------------------------------------------- */
  function frame() {
    rx += (x - rx) * RING_EASE;      // the lag is the whole character of it
    ry += (y - ry) * RING_EASE;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(45deg)`;
    arrow.style.transform = `translate(${x}px, ${y}px)`;   // tip on the point
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) rotate(45deg)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
