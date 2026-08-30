/* ============================================================================
   icons.js — every glyph in the site, as inline SVG strings.

   Inline SVG (instead of an icon font or <img>) means each icon inherits the
   text color via `stroke="currentColor"`, so a single CSS rule can recolor
   them per card theme. That is the whole reason not to use PNGs here.
   ========================================================================== */

/** The house mark: an 8-point compass star. Used in the sidebar, on the pack,
 *  in the constellation, and as a divider ornament. */
export const compass = (size = 24) => `
<svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="cmp-${size}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffe9b8"/>
      <stop offset="55%" stop-color="#f3cf7a"/>
      <stop offset="100%" stop-color="#d99a5b"/>
    </linearGradient>
  </defs>
  <!-- long points (N/S/E/W) -->
  <path d="M50 2 L57 43 L50 50 L43 43 Z" fill="url(#cmp-${size})"/>
  <path d="M50 98 L43 57 L50 50 L57 57 Z" fill="url(#cmp-${size})"/>
  <path d="M2 50 L43 43 L50 50 L43 57 Z" fill="url(#cmp-${size})" opacity=".85"/>
  <path d="M98 50 L57 57 L50 50 L57 43 Z" fill="url(#cmp-${size})" opacity=".85"/>
  <!-- short diagonal points -->
  <path d="M22 22 L46 44 L50 50 L44 46 Z" fill="url(#cmp-${size})" opacity=".55"/>
  <path d="M78 22 L56 46 L50 50 L54 44 Z" fill="url(#cmp-${size})" opacity=".55"/>
  <path d="M22 78 L44 54 L50 50 L46 56 Z" fill="url(#cmp-${size})" opacity=".55"/>
  <path d="M78 78 L54 56 L50 50 L56 54 Z" fill="url(#cmp-${size})" opacity=".55"/>
</svg>`;

const s = (body, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;

/** Sidebar icons — one per NAV entry in data.js. */
export const NAV_ICONS = {
  user: s(`<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c.6-4 3.7-6 7.5-6s6.9 2 7.5 6"/>`),
  grid: s(`<path d="M12 3.2 4.6 12 12 20.8 19.4 12Z" opacity=".35"/>
           <circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="4" r="1.1"/>
           <circle cx="19.6" cy="12" r="1.1"/><circle cx="12" cy="20" r="1.1"/>
           <circle cx="4.4" cy="12" r="1.1"/>`),
  hourglass: s(`<path d="M7 3h10M7 21h10"/><path d="M8 3v3.2c0 2 4 3.8 4 5.8s-4 3.8-4 5.8V21"/>
                <path d="M16 3v3.2c0 2-4 3.8-4 5.8s4 3.8 4 5.8V21"/>`),
  image: s(`<rect x="3.2" y="4.6" width="17.6" height="14.8" rx="1.6"/>
            <circle cx="8.4" cy="9.6" r="1.5"/><path d="m4.2 17 4.6-4.4 3.4 3 3-2.6 4.6 4"/>`),
  info: s(`<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.4M12 7.9v.1"/>`),
  mail: s(`<rect x="3" y="5.4" width="18" height="13.2" rx="1.6"/><path d="m3.6 6.6 8.4 6 8.4-6"/>`),
};

/** Project icons — one per PROJECTS[i].icon in data.js. */
export const PROJECT_ICONS = {
  brain: s(`<path d="M9.5 5.2a2.4 2.4 0 0 0-2.4 2.4A2.3 2.3 0 0 0 5.4 10a2.4 2.4 0 0 0 .5 3.6A2.4 2.4 0 0 0 7 17.4a2.4 2.4 0 0 0 4.4 1.2V5.9a2.3 2.3 0 0 0-1.9-.7Z"/>
            <path d="M14.5 5.2a2.4 2.4 0 0 1 2.4 2.4A2.3 2.3 0 0 1 18.6 10a2.4 2.4 0 0 1-.5 3.6 2.4 2.4 0 0 1-1.1 3.8 2.4 2.4 0 0 1-4.4 1.2"/>`),
  chart: s(`<path d="M4 19.2h16"/><path d="M5.6 15.4c2-4.6 3.4-7.6 5.2-7.6 2.2 0 2.4 6 4.2 6 1.4 0 2.2-2.4 3.4-4.6"/>`),
  cat: s(`<path d="M5.4 9.4 4.6 5l3.6 2.2a8.4 8.4 0 0 1 7.6 0L19.4 5l-.8 4.4a6.6 6.6 0 0 1 1 3.4c0 3.4-3.4 5.8-7.6 5.8s-7.6-2.4-7.6-5.8a6.6 6.6 0 0 1 1-3.4Z"/>
          <path d="M9.4 12.6v.1M14.6 12.6v.1M10.8 15.4h2.4"/>`),
  bars: s(`<path d="M4 19.2h16"/><path d="M7 19V9.6M11.6 19V6M16.2 19v-6.6"/>`),
  wave: s(`<rect x="3.6" y="4.4" width="16.8" height="15.2" rx="3"/>
           <path d="M6.6 12.4h2.2l1.6-3.6 2 7 1.8-4.4 1.2 1h1.9"/>`),
  braces: s(`<path d="M9.6 4.4c-2 0-2.6 1-2.6 2.8 0 2.2-.4 3.4-2 4.8 1.6 1.4 2 2.6 2 4.8 0 1.8.6 2.8 2.6 2.8"/>
             <path d="M14.4 4.4c2 0 2.6 1 2.6 2.8 0 2.2.4 3.4 2 4.8-1.6 1.4-2 2.6-2 4.8 0 1.8-.6 2.8-2.6 2.8"/>`),
  map: s(`<path d="M9 4.2 3.8 6.4v13.4L9 17.6l6 2.2 5.2-2.2V4.2L15 6.4Z"/>
          <path d="M9 4.2v13.4M15 6.4v13.4"/>`),
  flame: s(`<path d="M12 3.4c.6 3 2.2 4 3.7 5.6a6.6 6.6 0 1 1-9.9 8.7A6.6 6.6 0 0 1 8 9c.3 1.4.9 2.2 1.7 2.6-.5-3.6.4-6.4 2.3-8.2Z"/>
            <path d="M12 20.6a3 3 0 0 1-1.4-5.7c.6 1 1.1 1.4 1.9 1.6-.2-1.4.2-2.4 1-3.1a3 3 0 0 1-1.5 7.2Z"/>`),
  rings: s(`<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="5.2"/>
            <circle cx="12" cy="12" r="1.9"/><path d="M12 3.6v3M20.4 12h-3M12 20.4v-3M3.6 12h3"/>`),
  gamepad: s(`<path d="M8.4 8.6h7.2a4.6 4.6 0 0 1 4.5 3.7l.7 3.6a2.5 2.5 0 0 1-4.4 2l-1.3-1.5H8.9l-1.3 1.5a2.5 2.5 0 0 1-4.4-2l.7-3.6a4.6 4.6 0 0 1 4.5-3.7Z"/>
              <path d="M8 12v2.4M6.8 13.2h2.4M15.4 12.6v.1M17.4 14.2v.1"/>`),
  speech: s(`<path d="M20.4 12.4c0 3.6-3.6 6.5-8 6.5a9.9 9.9 0 0 1-2.5-.3l-4.3 1.8 1.3-3.4a6.2 6.2 0 0 1-2.5-4.6c0-3.6 3.6-6.5 8-6.5s8 2.9 8 6.5Z"/>
             <path d="M9.2 11.8v.1M12.4 11.8v.1M15.6 11.8v.1"/>`),
  building: s(`<path d="M4.4 20.4V6.6l7-2.6v16.4M11.4 20.4h8.2V10l-8.2-2.4"/>
               <path d="M7 9.4v.1M7 13v.1M7 16.6v.1M15 12.6v.1M15 16.2v.1"/>`),
  shield: s(`<path d="M12 3.4 5.2 6v6.1c0 3.7 2.7 7 6.8 8.5 4.1-1.5 6.8-4.8 6.8-8.5V6Z"/>
             <path d="M9 12.4c.9-.9 1.4-1.8 2-3.2.6 1.4 1.1 2.3 2 3.2M9.6 15.4h4.8"/>`),
  scatter: s(`<path d="M4.6 4.6v14.8h14.8"/>
              <circle cx="9" cy="15" r="1"/><circle cx="12" cy="11.6" r="1"/>
              <circle cx="15.4" cy="12.6" r="1"/><circle cx="17.6" cy="8" r="1"/>
              <circle cx="11" cy="16.6" r="1"/><circle cx="14.6" cy="8.6" r="1"/>`),
};

/** Small ornaments used on the About page. */
export const ABOUT_ICONS = {
  flask: s(`<path d="M10 3.4h4M10.6 3.4v5.9L5.4 17.8a2.2 2.2 0 0 0 1.9 3.3h9.4a2.2 2.2 0 0 0 1.9-3.3l-5.2-8.5V3.4"/>
            <path d="M7.8 14.4h8.4M10.4 17.6v.1M13.4 18.8v.1"/>`),
  people: s(`<circle cx="9" cy="8.4" r="3.1"/><path d="M3.4 19.6c.5-3.3 2.9-5 5.6-5s5.1 1.7 5.6 5"/>
             <path d="M15.6 5.8a3.1 3.1 0 0 1 0 5.6M17 14.9c2 .6 3.3 2.2 3.6 4.7"/>`),
  sparkles: s(`<path d="M12 4.4 13.3 9l4.6 1.3-4.6 1.3L12 16.2l-1.3-4.6L6.1 10.3 10.7 9Z"/>
               <path d="M18 15.6l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6ZM6.4 4l.5 1.6 1.6.5-1.6.5L6.4 8l-.5-1.4-1.6-.5 1.6-.5Z"/>`),
  planet: s(`<circle cx="12" cy="12" r="5.4"/>
             <path d="M4.6 15.6c-1.6 1.6-2.3 3-1.7 3.9.9 1.4 4.8.3 8.8-2.4s6.6-6.1 5.7-7.5c-.5-.8-2-.8-4-.1"/>`),
};

/* Brand marks are filled shapes, not stroked line art, so they need their own
   wrapper — they inherit color the same way via `fill="currentColor"`. */
const brand = (body) =>
  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${body}</svg>`;

export const SOCIAL_ICONS = {
  github: brand(`<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>`),
  linkedin: brand(`<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`),
};
