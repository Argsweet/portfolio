/* ============================================================================
   starfield.js — the ambient twinkling background.

   Why canvas instead of 100 <div>s: each star is 3 numbers in an array, and
   one canvas is one element for the browser to lay out. Drawing 120 stars in
   a loop is cheaper than making the browser manage 120 DOM nodes.
   ========================================================================== */

export function startStarfield(canvas, count = 120) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  let raf;

  function resize() {
    // devicePixelRatio keeps the stars crisp on retina/high-DPI screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: Math.random() * 1.2 + 0.3,
      // each star gets its own speed + phase so they never blink in unison
      speed: Math.random() * 0.0012 + 0.0004,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.02 + 0.004,
    }));
  }

  function frame(t) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (const s of stars) {
      // sine wave from -1..1 mapped to an opacity of 0.15..1
      const twinkle = (Math.sin(t * s.speed + s.phase) + 1) / 2;
      ctx.globalAlpha = 0.15 + twinkle * 0.85;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // slow upward drift; wrap around at the top
      s.y -= s.drift;
      if (s.y < 0) s.y = canvas.clientHeight;
    }
    raf = requestAnimationFrame(frame);
  }

  resize();
  // A ResizeObserver is more reliable than window.resize alone: it also fires
  // once the element actually gets its first size, which can happen AFTER
  // this module runs.
  new ResizeObserver(resize).observe(canvas);

  // Honor the reduced-motion setting: draw one static frame and stop.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    frame(0);
    cancelAnimationFrame(raf);
    return;
  }
  raf = requestAnimationFrame(frame);
}
