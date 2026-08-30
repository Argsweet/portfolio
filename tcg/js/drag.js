/* ============================================================================
   drag.js — swipe to cut the pack open, the way TCG Pocket does it.

   Three rules taken from the real thing:
     1. The cut FOLLOWS your finger, BOTH WAYS. Push right and it opens, pull
        back left and it closes again, live. It is not a threshold that flips
        at the end, and it is not one-way — the foil sits exactly where your
        hand is.
     2. Let go without finishing and the foil CLOSES back up, eased. The cut
        only persists while you are holding it, so an abandoned half-swipe
        never leaves the pack stuck part-open.
     3. A fast flick across finishes the job, because you did swipe the width.

   This file does NOT animate anything. It turns the gesture into one number —
   `--drag-progress`, 0 to 1 — and writes it to the element. css/pack.css
   decides what that number looks like. Input logic here, visuals there.
   ========================================================================== */

const DISTANCE = 210;           // px of swipe for a full cut across the pack
const VELOCITY_THRESHOLD = 0.7; // px per ms — a decisive flick
const FLICK_MIN_PROGRESS = 0.75;// a flick only finishes a cut that is nearly done
                                // (lower than this and a quick half-swipe pops
                                //  the pack open when you did not ask it to)

export function makeDraggable(el, { onMove, onRelease }) {
  let dragging = false;
  let opened = false;
  let startX = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let progress = 0;    // how far the pack is cut, 0-1. Never goes down.
  let base = 0;        // progress when the current swipe started
  let queued = null;

  /* --- batched writes ---------------------------------------------------
     Setting a CSS variable is cheap, but pointermove can fire several times
     per frame. rAF collapses those into one write per painted frame. */
  function commit(p) {
    progress = p;
    if (queued !== null) return;
    queued = requestAnimationFrame(() => {
      queued = null;
      el.style.setProperty("--drag-progress", progress.toFixed(4));
      onMove?.(progress);
    });
  }

  function down(e) {
    if (opened) return;
    dragging = true;
    startX = e.clientX;
    lastX = e.clientX;
    lastT = e.timeStamp;
    velocity = 0;
    base = progress;               // carry on from where the last swipe stopped
    el.classList.add("is-cutting"); // live: no easing, the cut tracks the hand
    el.classList.remove("is-resting");
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  }

  function move(e) {
    if (!dragging || opened) return;

    // signed on purpose: a negative dx pulls the cut back closed. Clamping to
    // >= 0 here is what made it feel stuck — the foil could only ever open.
    const dx = e.clientX - startX;

    const dt = e.timeStamp - lastT;
    if (dt > 0) {
      // smoothed, so one jittery frame cannot decide the whole gesture
      velocity = velocity * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
      lastX = e.clientX;
      lastT = e.timeStamp;
    }

    // relative to where THIS swipe started, so you can scrub it open and shut
    const p = Math.min(1, Math.max(0, base + dx / DISTANCE));
    commit(p);

    if (p >= 1) finish(e);
  }

  function up(e) {
    if (!dragging || opened) return;
    if (velocity > VELOCITY_THRESHOLD && progress > FLICK_MIN_PROGRESS) return finish(e);
    // didn't get through it: the foil closes back up. `is-resting` swaps the
    // live no-lag tracking for an eased transition, so this reads as the pack
    // relaxing shut rather than snapping.
    dragging = false;
    el.classList.remove("is-cutting");
    el.classList.add("is-resting");
    try { el.releasePointerCapture(e.pointerId); } catch (_) {}
    commit(0);
  }

  /** Cut all the way through — hand back to the state machine. */
  function finish(e) {
    dragging = false;
    opened = true;
    el.classList.remove("is-cutting");
    el.classList.add("is-resting");
    try { el.releasePointerCapture(e?.pointerId); } catch (_) {}
    commit(1);
    onRelease?.();
  }

  el.addEventListener("pointerdown", down);
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);

  // Keyboard fallback — a portfolio that only opens with a mouse gesture locks
  // people out. Arrows nudge the cut open and closed; Enter finishes it.
  el.addEventListener("keydown", (e) => {
    if (opened) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      el.classList.add("is-resting");
      const p = Math.min(1, Math.max(0, progress + (e.key === "ArrowRight" ? 0.25 : -0.25)));
      commit(p);
      if (p >= 1) finish();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.classList.add("is-resting");
      finish();
    }
  });

  return {
    /** Back to a sealed pack (the Open Pack button). */
    reset() {
      opened = false;
      dragging = false;
      base = 0;
      el.classList.remove("is-cutting", "is-resting");
      commit(0);
      // also write it straight away: reset happens behind the blink, and the
      // pack has to be sealed the instant the screen comes back, not one
      // animation frame later
      el.style.setProperty("--drag-progress", "0");
    },
    get progress() { return progress; },
  };
}
