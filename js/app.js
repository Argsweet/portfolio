/* ============================================================================
   app.js — the state machine + all rendering.

   Flow:  pack --(drag)--> tearing --(620ms)--> card --(click)--> blink --> site

   No framework on purpose. "Rendering" here = build an HTML string from
   data.js and drop it into a container. That is what React does under the
   hood; doing it by hand once makes React make sense later.
   ========================================================================== */

import { CARDS, TAB_ORDER, PROJECTS, NAV, PROFILE, ABOUT } from "./data.js";
import { makeDraggable } from "./drag.js";
import { startStarfield } from "./starfield.js";
import { updateRadar } from "./radar.js";
import { renderConstellation, renderProjectDetail, lightEdges } from "./constellation.js";
import { compass, NAV_ICONS, ABOUT_ICONS, SOCIAL_ICONS } from "./icons.js";
import { initCursor } from "./cursor.js";

/* ---------------------------------------------------------------------------
   1. STATE — every screen is a pure function of these values.
   ------------------------------------------------------------------------- */
const state = {
  stage: "pack",   // pack | tearing | card | profile
  pulled: "data",  // which card came out of the pack
  tab: "data",     // which class tab is selected
  view: "profile", // which sidebar destination is showing
  project: 0,      // which star is selected in the constellation
};

const app = document.getElementById("app");
const $ = (id) => document.getElementById(id);

function setStage(next) {
  state.stage = next;
  app.dataset.stage = next;
}

/** Point the CSS color variables at a card. One call = the whole site retints.
 *  They go on <html> as well as #app because the custom cursor and its
 *  particles live outside #app (they must, to stay clear of its overflow and
 *  filter), and they still need to pick up the active card's colors. */
function applyTheme(key) {
  for (const el of [app, document.documentElement]) {
    el.style.setProperty("--accent", CARDS[key].accent);
    el.style.setProperty("--accent-2", CARDS[key].accent2);
  }
}

/* ---------------------------------------------------------------------------
   2. THE PACK
   ------------------------------------------------------------------------- */
const pack = $("pack");

/* The foil artwork lives once in a <template> and is cloned into both torn
   parts, so each half carries a full copy of the pack and the clip-path
   decides which slice of it you see. */
function buildPack() {
  const tpl = $("packFaceTemplate");
  document.querySelectorAll(".pack__part").forEach((part) => {
    part.appendChild(tpl.content.cloneNode(true));
  });
}
buildPack();

const hint = $("hint");

const dragHandle = makeDraggable(pack, {
  onMove(progress) {
    // the prompt tracks the cut, so the pack always tells you what it wants
    hint.querySelector(".hint__text").textContent =
      progress > 0.7 ? "Almost through" : progress > 0.04 ? "Keep swiping" : "Swipe right to open";
    hint.style.opacity = String(1 - progress * 0.8);
  },
  onRelease: tearOpen,
});

function tearOpen() {
  hint.style.opacity = "0";   // inline styles beat the stylesheet, so clear it here
  state.pulled = pullRandomCard();
  applyTheme(state.pulled);
  setStage("tearing");           // CSS throws the two parts off screen
  setTimeout(() => {
    renderCard(state.pulled);
    setStage("card");
  }, 620);                        // matches the transition in pack.css
}

/* --- which card you get: every card has the same chance ------------------
   The rarity badge (SSR/SR/R) is now purely a label, not odds. To bring
   weighted pulls back, give each rarity a number of tickets and draw from
   the pooled tickets instead:
     const WEIGHTS = { SSR: 1, SR: 2, R: 3 };
     const pool = TAB_ORDER.flatMap((k) => Array(WEIGHTS[CARDS[k].rarity]).fill(k));
*/
function pullRandomCard() {
  return TAB_ORDER[Math.floor(Math.random() * TAB_ORDER.length)];
}


/** Point an <img> at a card's art. Photos fill their frame; the drawn figures
 *  float inside it. If a photo is missing, fall back to the figure rather than
 *  showing a broken image. */
function setCardArt(img, card) {
  const isPhoto = card.artFit === "cover";
  img.classList.toggle("is-photo", isPhoto);
  // a drawn figure floats inside a window in the card; a photo takes the whole
  // card, with the name plate laid over it
  img.parentElement?.classList.toggle("has-photo", isPhoto);
  img.alt = `Annabelle — ${card.label}`;
  img.onerror = () => {
    if (!card.artFallback || img.dataset.fellBack) return;
    img.dataset.fellBack = "1";
    img.classList.remove("is-photo");
    img.src = card.artFallback;
  };
  delete img.dataset.fellBack;
  img.src = card.art;
}

/* ---------------------------------------------------------------------------
   3. THE CARD
   ------------------------------------------------------------------------- */
function renderCard(key) {
  const c = CARDS[key];
  $("cardRarity").textContent = c.rarity;
  $("cardRole").textContent = c.label;
  $("cardTagline").textContent = c.tagline;
  setCardArt($("cardArt"), c);

  // replay the pop-in animation on every pull
  const frame = document.querySelector(".card__frame");
  frame.style.animation = "none";
  void frame.offsetWidth;        // force the browser to notice the change
  frame.style.animation = "";
}

/* holo tilt: the card leans toward your cursor */
const cardEl = $("revealCard");
const cardFrame = () => cardEl.querySelector(".card__frame");
cardEl.addEventListener("pointermove", (e) => {
  const r = cardEl.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
  const py = (e.clientY - r.top) / r.height - 0.5;
  cardFrame().style.setProperty("--tilt-y", `${px * 18}deg`);
  cardFrame().style.setProperty("--tilt-x", `${-py * 18}deg`);
});
cardEl.addEventListener("pointerleave", () => {
  cardFrame().style.setProperty("--tilt-x", "0deg");
  cardFrame().style.setProperty("--tilt-y", "0deg");
});

$("enterBtn").addEventListener("click", () => {
  state.tab = state.pulled;
  state.view = "profile";
  blinkTo(() => { renderSite(); setStage("profile"); });
});

$("rerollBtn").addEventListener("click", backToPack);
$("openPackBtn").addEventListener("click", () => blinkTo(backToPack));

function backToPack() {
  dragHandle.reset();
  hint.style.opacity = "1";
  hint.querySelector(".hint__text").textContent = "Swipe right to open";
  setStage("pack");
}

/* ---------------------------------------------------------------------------
   4. THE BLINK — bars close, the screen is swapped while it is dark, bars
   open again. Hiding the swap inside the dark moment is the entire trick.
   ------------------------------------------------------------------------- */
const blink = document.querySelector(".blink");

function blinkTo(swapScreens) {
  blink.classList.add("is-closing");
  setTimeout(() => {
    swapScreens();
    blink.classList.remove("is-closing");
    blink.classList.add("is-opening");
    setTimeout(() => blink.classList.remove("is-opening"), 520);
  }, 400);                       // matches bars-in in transition.css
}

/* ---------------------------------------------------------------------------
   5. THE SITE
   ------------------------------------------------------------------------- */
function renderSidebar() {
  $("sidebar").innerHTML = `
    <div class="sidebar__logo">${compass(44)}</div>
    <div class="sidebar__nav">
      ${NAV.map(
        (n) => `
        <button class="sidebar__btn ${n.view === state.view ? "is-active" : ""}"
                data-nav="${n.view}">
          ${NAV_ICONS[n.icon]}<span>${n.label}</span>
        </button>`
      ).join("")}
    </div>
    <div class="sidebar__foot">
      <button id="dimBtn" title="Dim the glow" aria-label="Dim the glow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.4 8.4 0 1 0 20 14.4Z"/>
        </svg>
      </button>
      <a href="home.html" title="Classic site" aria-label="Classic site">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.6 10.4 12 4.4l7.4 6v8.2a1 1 0 0 1-1 1h-4.2v-5.2H9.8v5.2H5.6a1 1 0 0 1-1-1Z"/>
        </svg>
      </a>
      <button disabled title="Sound: coming soon" aria-label="Sound: coming soon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V6.4l10-2v11.2"/><circle cx="6.6" cy="18" r="2.4"/><circle cx="16.6" cy="15.6" r="2.4"/>
        </svg>
      </button>
    </div>`;
}

function renderSocials() {
  $("social").innerHTML = PROFILE.socials
    .map(
      (l) => `
      <a href="${l.href}" target="_blank" rel="noopener" aria-label="${l.label}" title="${l.label}">
        ${SOCIAL_ICONS[l.icon] ?? ""}
      </a>`
    )
    .join("");
}

function renderTabs() {
  $("tabs").innerHTML = TAB_ORDER.map(
    (key, i) => `
      ${i ? `<span class="tabs__sep" aria-hidden="true">✦</span>` : ""}
      <button class="tab ${key === state.tab ? "is-active" : ""}" data-tab="${key}"
              role="tab" aria-selected="${key === state.tab}"
              style="--tab-accent:${CARDS[key].accent}">
        ${CARDS[key].label}
      </button>`
  ).join("");
}

function renderTimelineItems(entries) {
  return entries
    .map(
      (r) => `
      <div class="tl-item">
        <div class="tl-head">
          <span class="tl-role">${r.role}</span>
          <span class="tl-when">${r.when}</span>
        </div>
        <div class="tl-org">${r.org}</div>
        <ul>${r.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
}

function renderProfileView() {
  const c = CARDS[state.tab];
  applyTheme(state.tab);

  $("showcaseRarity").textContent = c.rarity;
  setCardArt($("showcaseArt"), c);

  $("detailRole").textContent = c.label;
  $("detailName").textContent = PROFILE.short;
  $("detailAbout").textContent = c.about;
  $("detailSkills").innerHTML = c.skills.map((s) => `<li>${s}</li>`).join("");
  $("detailResume").innerHTML = renderTimelineItems(c.resume);
  // morphs the existing hexagon toward the new numbers instead of rebuilding it
  updateRadar($("detailRadar"), c.stats);
}

/** Timeline view: every role from every card, newest first. */
function renderFullTimeline() {
  const seen = new Set();
  const all = TAB_ORDER.flatMap((k) => CARDS[k].resume)
    .filter((r) => {
      const key = `${r.role}@${r.org}`;
      if (seen.has(key)) return false;  // the same job appears on two cards
      seen.add(key);
      return true;
    })
    // `start` is a sortable "YYYY-MM"; string compare is enough for that
    // format, which is the whole reason to store dates that way
    .sort((a, b) => (b.start ?? "").localeCompare(a.start ?? ""));
  $("fullTimeline").innerHTML = renderTimelineItems(all);
}

function renderGallery() {
  $("gallery").innerHTML = TAB_ORDER.map(
    (k, i) => `
    <figure class="gal-card" data-tab-jump="${k}"
            style="--g-accent:${CARDS[k].accent}; --g-accent-2:${CARDS[k].accent2}; --delay:${i * 80}ms">
      <img class="${CARDS[k].artFit === "cover" ? "is-photo" : ""}"
           src="${CARDS[k].art}" alt="Annabelle — ${CARDS[k].label}"/>
      <figcaption>${CARDS[k].rarity} · ${CARDS[k].label}</figcaption>
    </figure>`
  ).join("");
}

function renderAbout() {
  const photo = ABOUT.photo
    ? `<img src="${ABOUT.photo}" alt="Photo of ${PROFILE.name}"/>`
    : `<div class="about__placeholder">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
              stroke-linecap="round" stroke-linejoin="round">
           <circle cx="12" cy="8.6" r="3.8"/><path d="M4.6 20.4c.7-4.2 3.9-6.4 7.4-6.4s6.7 2.2 7.4 6.4"/>
         </svg>
         <span>Photo goes here</span>
       </div>`;
  $("aboutPhoto").innerHTML = photo;

  $("aboutText").innerHTML = `
    <p class="about__kicker">${ABOUT.kicker}</p>
    <h2 class="about__headline">${ABOUT.headline}<span class="mark">✦</span></h2>
    <div class="about__divider"></div>
    ${ABOUT.paragraphs.map((p) => `<p class="lead">${p}</p>`).join("")}
    <div class="about__blocks">
      ${ABOUT.blocks
        .map(
          (b) => `
        <div class="about__block">
          <div class="about__badge">${ABOUT_ICONS[b.icon] ?? ""}</div>
          <div><h3>${b.title}</h3><p>${b.text}</p></div>
        </div>`
        )
        .join("")}
    </div>`;
}

function renderContact() {
  $("contact").innerHTML = [
    { label: PROFILE.email, href: `mailto:${PROFILE.email}`, note: "Email" },
    ...PROFILE.links.map((l) => ({ label: l.label, href: l.href, note: "Open" })),
  ]
    .map(
      (l) => `<a class="frame" href="${l.href}"><span>${l.label}</span><span>${l.note} →</span></a>`
    )
    .join("");
}

/* --- the constellation -----------------------------------------------------
   Built ONCE. Selecting a star must not rebuild the sky: replacing innerHTML
   would destroy and recreate every node, which restarts their entry animations
   and makes the whole page flicker on every click. Instead we toggle a class
   on the nodes that are already there, and only re-render the detail panel.
   This is the same reason React has keys — reuse the DOM you already have. */
function buildConstellation() {
  const box = $("constellation").getBoundingClientRect();
  // the sky is wider than it is tall, so the edge-finder needs to know that
  // or it will think horizontal hops are shorter than they look
  const aspect = box.height ? box.width / box.height : 1.35;
  $("constellation").innerHTML = renderConstellation(PROJECTS, state.project, aspect);
}

function selectProject(index) {
  state.project = index;
  document.querySelectorAll(".node").forEach((node) => {
    const isSel = Number(node.dataset.project) === index;
    node.classList.toggle("is-selected", isSel);
    node.setAttribute("aria-pressed", String(isSel));
  });

  lightEdges($("constellation"), index);

  const panel = $("projectDetail");
  panel.innerHTML = renderProjectDetail(PROJECTS[index]);
  // replay the panel's fade so the swap reads as a change, not a jump
  panel.style.animation = "none";
  void panel.offsetWidth;
  panel.style.animation = "";
}

/** Which sidebar destination is showing. Switching views is just an attribute
 *  flip plus the active marker — no re-rendering of any view's content. */
function setView(view) {
  state.view = view;
  app.dataset.view = view;
  document.querySelectorAll("[data-nav]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.nav === view)
  );
}

/** Full build — run once when you land on the site. */
function renderSite() {
  app.dataset.view = state.view;
  renderSidebar();
  renderSocials();
  renderTabs();
  renderProfileView();
  buildConstellation();
  selectProject(state.project);
  renderFullTimeline();
  renderGallery();
  renderAbout();
  renderContact();
}

/** Tab change — only the profile column depends on the active card. */
function changeTab(key) {
  state.tab = key;
  renderTabs();
  renderProfileView();
  setView("profile");
}

/* ---------------------------------------------------------------------------
   6. EVENTS — one listener per container instead of one per button
   ("event delegation"): clicks bubble up, so re-rendering the innerHTML never
   breaks the handlers.
   ------------------------------------------------------------------------- */
$("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-tab]");
  if (btn) changeTab(btn.dataset.tab);
});

$("sidebar").addEventListener("click", (e) => {
  if (e.target.closest("#dimBtn")) return app.classList.toggle("is-dim");
  const btn = e.target.closest("[data-nav]");
  if (btn) setView(btn.dataset.nav);
});

$("constellation").addEventListener("click", (e) => {
  const node = e.target.closest("[data-project]");
  if (node) selectProject(Number(node.dataset.project));
});

$("gallery").addEventListener("click", (e) => {
  const fig = e.target.closest("[data-tab-jump]");
  if (fig) changeTab(fig.dataset.tabJump);
});

$("resumeBtn").addEventListener("click", () => setView("timeline"));

/* ---------------------------------------------------------------------------
   7. BOOT
   ------------------------------------------------------------------------- */
startStarfield($("starfield"));
initCursor();
applyTheme(state.tab);

// Deep link: #profile / #projects / #about ... skips the pack. Handy while
// you are editing one page and do not want to re-open the pack every reload.
const deepLink = location.hash.slice(1);
if (NAV.some((n) => n.view === deepLink)) {
  state.view = deepLink;
  renderSite();
  setStage("profile");
}
