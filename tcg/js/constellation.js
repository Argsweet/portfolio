/* ============================================================================
   constellation.js — the projects sky.

   Two layers stacked on top of each other:
     1. an <svg> for the connecting lines (vector, scales with the container)
     2. absolutely-positioned HTML buttons for the stars (real focusable
        elements, so keyboard and screen readers work)

   Coordinates come straight from data.js (`pos: {x, y}` in 0–1). The SVG uses
   viewBox="0 0 100 100" + preserveAspectRatio="none" so those same 0–1 numbers
   become percentages in both layers — one coordinate system, two renderers.
   `vector-effect="non-scaling-stroke"` keeps the lines hairline-thin even
   though the viewBox is being stretched.
   ========================================================================== */

import { PROJECT_ICONS, compass } from "./icons.js";

const CENTER = { x: 0.5, y: 0.47 };

/** Random-looking but STABLE sparkles: a hash, not Math.random, so they do
 *  not jump around every time the view re-renders. */
function sparkles(count = 26) {
  let out = "";
  for (let i = 1; i <= count; i++) {
    const x = ((i * 37.5) % 97) + 1.5;
    const y = ((i * 61.3) % 93) + 3;
    const r = ((i * 13) % 5) / 10 + 0.15;
    const o = (((i * 7) % 6) + 2) / 12;
    out += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}"
              fill="#fff" opacity="${o}"/>`;
  }
  return out;
}

/* ---------------------------------------------------------------------------
   WHICH STARS GET CONNECTED — a minimum spanning tree (Prim's algorithm).

   Real constellations are short lines between neighbouring stars. Two things
   destroy that illusion: a line from every star to a central hub (that reads
   as a wheel), and hand-picked links that leap across the whole sky.

   So instead of listing connections by hand, we compute them: start from one
   star, and repeatedly add the shortest line that brings in a star not yet
   connected. The result is guaranteed to touch every star exactly once, using
   the shortest edges available — which is precisely what the eye reads as a
   constellation. n is tiny here, so the naive O(n^3) version is fine.

   `aspect` matters: positions are 0–1 fractions of a box that is wider than
   it is tall, so without it the algorithm thinks horizontal distance is
   cheaper than it looks on screen.
   ------------------------------------------------------------------------- */
function constellationEdges(points, aspect = 1.35) {
  if (points.length < 2) return [];
  const dist2 = (a, b) => {
    const dx = (a.x - b.x) * aspect;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  };

  const connected = new Set([0]);
  const edges = [];
  let longest = 0;
  while (connected.size < points.length) {
    let best = null;
    for (const i of connected) {
      for (let j = 0; j < points.length; j++) {
        if (connected.has(j)) continue;
        const d = dist2(points[i], points[j]);
        if (!best || d < best.d) best = { i, j, d };
      }
    }
    edges.push([best.i, best.j]);
    longest = Math.max(longest, best.d);
    connected.add(best.j);
  }

  /* A spanning tree is always an open shape, which can leave a gap that reads
     as a mistake rather than a decision — a ring of stars missing one link.
     So close gaps, but only cautiously: an extra line has to be no longer
     than the tree's own longest edge, and it must not cross anything. Two at
     most. Crossings are exactly what made the old version look like a web. */
  const candidates = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) continue;
      const d = dist2(points[i], points[j]);
      if (d <= longest) candidates.push({ i, j, d });
    }
  }
  candidates.sort((a, b) => a.d - b.d);

  let added = 0;
  for (const c of candidates) {
    if (added >= 2) break;
    const crosses = edges.some(([a, b]) =>
      a !== c.i && a !== c.j && b !== c.i && b !== c.j &&
      segmentsCross(points[c.i], points[c.j], points[a], points[b])
    );
    if (crosses) continue;
    edges.push([c.i, c.j]);
    added++;
  }
  return edges;
}

/** Standard orientation test: two segments cross when each straddles the other. */
function segmentsCross(p1, p2, p3, p4) {
  const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

function line(a, b, i, j) {
  return `<line class="sky__link" data-a="${i}" data-b="${j}"
            x1="${a.x * 100}" y1="${a.y * 100}" x2="${b.x * 100}" y2="${b.y * 100}"
            vector-effect="non-scaling-stroke"/>`;
}

export function renderConstellation(projects, selectedIndex, aspect = 1.35) {
  const edges = constellationEdges(projects.map((p) => p.pos), aspect)
    .map(([i, j]) => line(projects[i].pos, projects[j].pos, i, j))
    .join("");

  const nodes = projects
    .map(
      (p, i) => `
      <button class="node ${i === selectedIndex ? "is-selected" : ""}"
              data-project="${i}"
              style="left:${p.pos.x * 100}%; top:${p.pos.y * 100}%; --delay:${i * 90}ms"
              aria-pressed="${i === selectedIndex}">
        <span class="node__diamond">
          <span class="node__icon">${PROJECT_ICONS[p.icon] ?? ""}</span>
        </span>
        <span class="node__name">${p.short ?? p.name}</span>
        <span class="node__cat">${p.category}</span>
      </button>`
    )
    .join("");

  return `
    <svg class="sky" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${edges}${sparkles()}
    </svg>
    <div class="sky__core" aria-hidden="true">${compass(96)}</div>
    ${nodes}`;
}

/** Brighten the lines touching the selected star. */
export function lightEdges(root, index) {
  root.querySelectorAll(".sky__link").forEach((el) => {
    const touches = +el.dataset.a === index || +el.dataset.b === index;
    el.classList.toggle("is-lit", touches);
  });
}

/** The panel on the right that describes whichever star is selected. */
export function renderProjectDetail(p) {
  return `
    <div class="pdetail__icon">${PROJECT_ICONS[p.icon] ?? ""}</div>
    <h3 class="pdetail__name">${p.name}</h3>
    ${p.year ? `<p class="pdetail__year">${p.year}</p>` : ""}
    <ul class="tagrow">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
    <div class="ornament" aria-hidden="true"><span></span>✦<span></span></div>
    <p class="pdetail__blurb">${p.blurb}</p>
    <h4 class="pdetail__head">Key Tech</h4>
    <ul class="tagrow tagrow--tight">${p.tech.map((t) => `<li>${t}</li>`).join("")}</ul>
    <div class="ornament" aria-hidden="true"><span></span>✦<span></span></div>
    <h4 class="pdetail__head">Impact</h4>
    <ul class="pdetail__impact">
      ${p.impact.map((t) => `<li><span aria-hidden="true">✦</span>${t}</li>`).join("")}
    </ul>
    ${p.link
      ? `<a class="btn btn--wide" href="${p.link}" target="_blank" rel="noopener">
           View project <span aria-hidden="true">→</span>
         </a>`
      : ""}`;
}
