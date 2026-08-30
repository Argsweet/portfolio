# Annabelle Guiditta — portfolio

The site at <https://argsweet.github.io/portfolio/> is a card-pack opener; the
earlier lab pages are still here (`home.html`, `projects/`, `resume/`, `meta/`,
`contact/`) and reachable from the nav.

## The pack opener — how this thing works

A card-pack opener intro for the portfolio: drag the foil pack → it tears open
under your hand → a card is revealed → the screen blinks → you land on the site
(profile, constellation of projects, timeline, gallery, about, contact).

Plain HTML + CSS + JavaScript. **No npm, no build step, no framework.** Every
effect in here is something you can read top to bottom.

---

## Running it

ES modules do not load from `file://`, so open it through a tiny local server:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000/>.
(VS Code's "Live Server" extension does the same thing with a click.)

**If an edit does not seem to take effect, hard-reload** (Ctrl+Shift+R).
Browsers cache ES modules aggressively, and `python -m http.server` sends no
cache headers to tell it otherwise — you can end up staring at an old copy of
`data.js` wondering why nothing changed.

Add a hash to skip the pack while you work on a page — `#profile`, `#projects`,
`#about`, `#timeline`, `#gallery`. A hash only takes effect on a
full page load, so change the URL and refresh.

---

## The map

| File | What it owns |
| --- | --- |
| `index.html` | The skeleton. Every stage and view exists in the DOM at once. |
| `js/data.js` | **Your content.** Cards, stats, skills, resume, projects, about. |
| `js/app.js` | The state machine + which piece re-renders when. |
| `js/drag.js` | The swipe gesture → one number, `--drag-progress`. |
| `js/radar.js` | The hexagon stat chart and the tween that realigns it. |
| `js/constellation.js` | The projects sky: stars in HTML, lines computed as a spanning tree. |
| `js/icons.js` | Every glyph, as inline SVG. |
| `js/starfield.js` | The twinkling background, on a `<canvas>`. |
| `css/base.css` | Tokens, cut-corner frames, sidebar, topbar, buttons. |
| `css/pack.css` | The foil pack, its crimped edges, and the tear. |
| `css/card.css` | Card pop-in, holo sheen, mouse tilt. |
| `css/transition.css` | The blink (black bars). |
| `css/profile.css` | Three-column profile, timeline, gallery, contact. |
| `css/projects.css` | Constellation + project detail panel. |
| `css/about.css` | The "nice to meet you" page. |
| `assets/pack.png` | The pack artwork — your rendered reference, cropped tight. |
| `assets/photo/*.jpg` | Card photos (one per card) and the About portrait. |
| `assets/art/*.svg` | Drawn stand-ins, used automatically if a photo is missing. |

---

## Four ideas that run everything

**1. One attribute is the app state.**
`<div id="app" data-stage="pack" data-view="profile">`. CSS decides what is
visible:

```css
.stage { display: none; }
#app[data-stage="card"] .stage--card { display: flex; }
```

JavaScript never hides or shows anything directly — it writes
`app.dataset.stage = "card"` and CSS reacts.

**2. The gesture produces a number, not an animation.**
`js/drag.js` converts your swipe into `--drag-progress`, 0 → 1. `css/pack.css`
decides what that number *means*: how long the cut is, where the glowing cut
point sits, how far the strip peels, how much the pack leans. Input logic and
visuals stay independent, so you can retune the look without touching the
gesture, and vice versa.

Two rules borrowed from Pokémon TCG Pocket: the cut follows your finger rather
than snapping open at a threshold, and it follows it **both ways** — push right
to open the foil, pull back left to close it, live. Let go without getting all
the way across and it eases shut again.

**3. The angular look is one shape, reused.**
Every panel, button, chip, and card is the same cut-corner `clip-path` with a
different `--cut` size. The 1px border is a second copy of that shape, inset by
1px, sitting behind the first — that is how you outline a non-rectangular box.

**4. Shapes come from rules, not hand-placed decoration.**
The constellation lines are not listed in `data.js` — `constellationEdges()`
builds a minimum spanning tree over the star positions, so every project joins
its nearest neighbour and no line leaps across the sky. Hand-picked links plus
a spoke to the centre is what turns a constellation into a spiderweb.

**5. Re-render only what changed.**
Clicking a star in the constellation does *not* rebuild the sky (that would
restart every entry animation and make the page flicker). It toggles a class on
nodes that already exist and re-renders only the detail panel. Same reason the
stat hexagon is tweened vertex-by-vertex instead of being rebuilt: switching
cards should *realign* the shape, not pop a new one in.

---

## Things to change first (in rough order)

1. **Your words.** `js/data.js` — taglines, stats (6 per card = a hexagon),
   skills, `resume` blocks, `PROJECTS`, `ABOUT`. Nothing else needs touching for
   the content to be yours.
2. **Your art.** Drop transparent PNGs into `assets/art/` and point each card's
   `art:` at them (~600×840 works well). For the About page, set `ABOUT.photo`
   to your headshot — it replaces the placeholder automatically.
   To swap the pack itself, replace `assets/pack.png` (crop it tight to the
   pack, no background) and set `.pack`'s width/height in `css/pack.css` to the
   new image's aspect ratio, or it will stretch.
3. **Your links.** `PROFILE.socials` drives the GitHub/LinkedIn buttons in the
   bottom-right corner; `PROFILE.email` is still a placeholder. The Contact
   view is archived — uncomment its line in `NAV` to bring it back.

   Old note: `PROFILE.email` and `PROJECT.links` in `data.js` are still
   placeholders. The projects themselves are your real DSC 106 repos and point
   at their live GitHub Pages builds; a project with an empty `link:` renders
   its VIEW PROJECT button disabled.
4. **The feel.** In `js/drag.js`: `DISTANCE` is how long the swipe has to be
   for a full cut, `VELOCITY_THRESHOLD` is how fast a flick counts, and
   `FLICK_MIN_PROGRESS` is how much of the cut has to already be done before a
   flick is allowed to finish it (too low and a quick half-swipe pops the pack
   open when you did not ask).
5. **The colors.** `css/base.css` `:root`. Per-card accents come from `data.js`;
   the space background, gold trim, fonts, and `--cut` live in `:root`.

## Deliberate experiments (learning, not busywork)

- In `css/pack.css`, change the multipliers on `.pack__part--top`'s transform
  (`26px`, `-34px`, `15deg`). You are editing the *mapping* from gesture to
  motion — this is the core skill behind every good interaction.
- In the same file, change `.pack__rip`'s `scaleX(var(--drag-progress))` to a
  fixed `scaleX(1)`. The cut stops being drawn by your finger and just lights
  up all at once — which reads as a line hanging in the air, not an opening
  pack. That one function of progress is most of what sells the gesture.
- In `css/card.css`, change the `60%` keyframe of `pop-in` from `scale(1.06)` to
  `scale(1.0)`. The overshoot is the whole difference between "a card appeared"
  and "a card *landed*".
- In `js/radar.js`, set `DURATION` to `3000` and switch tabs. Watching the
  hexagon crawl to its new shape shows you exactly what a tween is doing.
- In `js/app.js`, comment out the `setTimeout` in `blinkTo()` and call
  `swapScreens()` directly. The blink stops covering the swap and you see the
  cut. That is *why* the bars exist.
- Add a fifth card to `CARDS` and `TAB_ORDER` in `data.js`. Nothing else should
  need to change — if it does, the code is not data-driven enough yet.

---

## If you later want React

The state machine ports almost line for line:

| here | React |
| --- | --- |
| `state.stage` + `app.dataset.stage` | `const [stage, setStage] = useState()` |
| `renderProfileView()` string building | JSX in a component |
| `js/drag.js` | `<motion.div drag="x" onDragEnd={...}>` (framer-motion) |
| `selectProject()` class toggling | React's keyed reconciliation, for free |
| `css/*.css` variables | the same CSS variables, or Tailwind classes |

The two `.jsx` prototypes you already have are that version. Nothing here is
wasted — you would be writing the same `CARDS` object either way.
