/* ============================================================================
   radar.js — the hexagon stat chart, and the tween that realigns it.

   A radar chart is one idea repeated N times: put each stat at an equal slice
   of a circle, and push it out from the center by its value. Six stats = six
   points = a hexagon. The maths is two lines:

       angle = -90° + i * (360° / n)      (start at the top, go clockwise)
       point = center + (value / 100) * radius * (cos angle, sin angle)

   Everything else here is making the LABELS behave, which is the actual hard
   part of a radar chart: the viewBox is deliberately wider than it is tall to
   leave gutters for the side labels, and long names wrap onto two lines
   instead of running out of the panel.

   Switching cards does not rebuild the shape. `updateRadar` keeps the same
   <polygon> and walks its vertices from the old values to the new ones, so
   the hexagon visibly realigns instead of popping in again.
   ========================================================================== */

const W = 360;          // wider than tall: the extra width is label gutter
const H = 306;
const CX = W / 2;
const CY = 150;
const RADIUS = 92;
const LABEL_GAP = 26;   // distance from the outer ring to the label block
const LINE_H = 12;      // between wrapped label lines
const RINGS = [0.25, 0.5, 0.75, 1];
const DURATION = 700;

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function angleOf(i, n) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}

function point(i, n, t, radius = RADIUS) {
  const a = angleOf(i, n);
  return [CX + Math.cos(a) * radius * t, CY + Math.sin(a) * radius * t];
}

function polygon(n, t, radius) {
  return Array.from({ length: n }, (_, i) => point(i, n, t, radius).join(",")).join(" ");
}

function shapeFor(values) {
  const n = values.length;
  return values.map((v, i) => point(i, n, v / 100).join(",")).join(" ");
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* ---------------------------------------------------------------------------
   LABELS
   SVG text does not wrap — there is no such thing as a width on <text>. So we
   split the label ourselves and emit one <tspan> per line. Two lines is the
   cap: past that the block starts colliding with the chart.
   ------------------------------------------------------------------------- */
function wrapLabel(label) {
  const words = label.split(/\s+/);
  if (words.length < 2) return [label];
  if (words.length === 2) return words;

  // 3+ words: break at whichever gap gets the two halves closest in length
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    if (Math.abs(a - b) < bestDiff) { bestDiff = Math.abs(a - b); best = i; }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function buildLabels(stats) {
  const n = stats.length;
  return stats
    .map((s, i) => {
      const lines = wrapLabel(s.label);
      const [lx, ly] = point(i, n, 1, RADIUS + LABEL_GAP);

      // anchor by which side of the chart the label sits on, so text grows
      // outward into the gutter instead of back across the hexagon
      const dx = lx - CX;
      const anchor = Math.abs(dx) < 12 ? "middle" : dx > 0 ? "start" : "end";

      // center the whole block (label lines + value) on the vertex direction
      const rows = lines.length + 1;
      const top = ly - ((rows - 1) * LINE_H) / 2;

      const lineTags = lines
        .map((line, j) => `<text class="radar__label" x="${lx}" y="${top + j * LINE_H}"
                             text-anchor="${anchor}">${line}</text>`)
        .join("");

      return `${lineTags}
        <text class="radar__value" data-i="${i}" x="${lx}"
              y="${top + lines.length * LINE_H + 2}" text-anchor="${anchor}">${s.value}</text>`;
    })
    .join("");
}

/** First render: build the whole chart. */
export function renderRadar(stats) {
  const n = stats.length;

  const rings = RINGS.map(
    (t) => `<polygon points="${polygon(n, t)}" fill="none"
              stroke="rgba(255,255,255,${t === 1 ? 0.18 : 0.08})" stroke-width="1"/>`
  ).join("");

  const spokes = Array.from({ length: n }, (_, i) => {
    const [x, y] = point(i, n, 1);
    return `<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}"
              stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
  }).join("");

  const dots = stats
    .map((s, i) => {
      const [x, y] = point(i, n, s.value / 100);
      return `<circle class="radar__dot" data-i="${i}" cx="${x}" cy="${y}" r="2.6" fill="var(--accent-2)"/>`;
    })
    .join("");

  return `
    <svg class="radar" viewBox="0 0 ${W} ${H}" role="img"
         aria-label="Stat chart: ${stats.map((s) => `${s.label} ${s.value}`).join(", ")}">
      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-2)" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.22"/>
        </linearGradient>
      </defs>
      ${rings}${spokes}
      <polygon class="radar__shape" points="${shapeFor(stats.map((s) => s.value))}"
               fill="url(#radar-fill)" stroke="var(--accent-2)" stroke-width="1.5"/>
      ${dots}
      <g class="radar__labels">${buildLabels(stats)}</g>
    </svg>`;
}

/**
 * Switching cards: keep the chart, move the vertices.
 * @param {HTMLElement} wrap   container holding the <svg>
 * @param {Array} stats        the new stats
 */
export function updateRadar(wrap, stats) {
  const svg = wrap.querySelector(".radar");

  // nothing to interpolate between -> build it fresh
  if (!svg || (svg.__values?.length ?? 0) !== stats.length) {
    wrap.innerHTML = renderRadar(stats);
    wrap.querySelector(".radar").__values = stats.map((s) => s.value);
    return;
  }

  const from = svg.__values;
  const to = stats.map((s) => s.value);
  const n = to.length;
  const shape = svg.querySelector(".radar__shape");
  const dots = [...svg.querySelectorAll(".radar__dot")];

  // The axis NAMES change with the card, and so does how they wrap, so the
  // label block is rebuilt outright. Only the shape is worth tweening.
  svg.querySelector(".radar__labels").innerHTML = buildLabels(stats);
  const values = [...svg.querySelectorAll(".radar__value")];

  svg.setAttribute(
    "aria-label",
    `Stat chart: ${stats.map((s) => `${s.label} ${s.value}`).join(", ")}`
  );

  cancelAnimationFrame(svg.__raf);

  const paint = (vals) => {
    shape.setAttribute("points", shapeFor(vals));
    vals.forEach((v, i) => {
      const [x, y] = point(i, n, v / 100);
      dots[i]?.setAttribute("cx", x);
      dots[i]?.setAttribute("cy", y);
      if (values[i]) values[i].textContent = Math.round(v);
    });
    // record what is on screen every frame: switching cards mid-tween has to
    // start from where the shape IS, or it jumps
    svg.__values = vals;
  };

  if (reduceMotion()) {
    paint(to);
    return;
  }

  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / DURATION);
    const e = easeOutCubic(t);
    paint(t < 1 ? from.map((v, i) => v + (to[i] - v) * e) : to);
    if (t < 1) svg.__raf = requestAnimationFrame(step);
  };
  svg.__raf = requestAnimationFrame(step);
}
