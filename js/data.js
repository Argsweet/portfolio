/* ============================================================================
   data.js — the single source of truth for the whole site.
   Everything on screen is generated from this file, so editing your resume,
   stats, or projects NEVER means touching layout code.

   NOTE: `stats` should have exactly 6 entries per card — that is what makes
   the radar chart a hexagon. Add a 7th and it becomes a heptagon; drop to 5
   and it becomes a pentagon. The chart adapts, the shape follows the data.
   ========================================================================== */

export const PROFILE = {
  name: "Annabelle Guiditta",
  short: "Annabelle",
  // TODO(annabelle): put the address you actually want public here.
  email: "you@ucsd.edu",
  links: [
    { label: "GitHub", href: "https://github.com/Argsweet" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aguiditta/" },
    { label: "Resume (PDF)", href: "#" },
  ],
  /** Shown as icon buttons in the bottom-right corner of the site. */
  socials: [
    { icon: "github", label: "GitHub", href: "https://github.com/Argsweet" },
    { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/aguiditta/" },
  ],
};

export const CARDS = {
  data: {
    label: "Data Scientist",
    rarity: "SSR",
    tagline: "Transforming noisy data into meaningful insights.",
    accent: "#c9a3ff", // main glow
    accent2: "#f3cf7a", // highlight / text
    art: "assets/photo/data.jpg",
    artFit: "cover",
    artFallback: "assets/art/data.svg",
    resumePdf: "assets/docs/resume-data.pdf",
    stats: [
      { label: "Analytical Thinking", value: 92 },
      { label: "Statistics", value: 88 },
      { label: "Programming", value: 90 },
      { label: "Data Viz", value: 87 },
      { label: "Research", value: 88 },
      { label: "Creativity", value: 84 },
    ],
    skills: [
      "Python", "R", "SQL", "Machine Learning",
      "Data Visualization", "Statistical Inference", "Analytics",
    ],
    about:
      "Data Science student at UCSD with a passion for turning data into meaningful insights. Experienced in statistical modeling, machine learning, and human-centered research.",
    resume: [
      {
        role: "Data Science Research Intern",
        org: "Scripps Research DTC — Quer Lab",
        when: "Jun – Aug 2026",
        start: "2026-06",
        bullets: [
          "Investigated sleep health and cognitive aging in older women using longitudinal Fitbit wearable and behavioral data.",
          "Processed large-scale Fitbit sleep datasets in Python: cleaning, cohort construction, sleep feature extraction, and longitudinal participant management.",
        ],
      },
      {
        role: "Data Science Intern",
        org: "Southern California Edison",
        when: "Jun – Aug 2025",
        start: "2025-06",
        bullets: [
          "Improved accuracy of SCE's most-viewed Power BI reliability dashboard by validating outage records and correcting automation errors — 1.24 minutes of the monthly 9-minute reduction goal (6.58M CMI, 5,703 customers impacted).",
          "Built a Python EPC/DYD parser that turned raw energy system files into structured pandas DataFrames, with a lookup for key fields.",
        ],
      },
      {
        role: "DSC 80 Tutor",
        org: "UC San Diego",
        when: "Summer 2026",
        start: "2026-06",
        bullets: ["Tutored Practice and Application of Data Science."],
      },
    ],
  },

  software: {
    label: "Software Engineer",
    rarity: "SR",
    tagline: "Building the tools the rest of the work runs on.",
    accent: "#8ecbff",
    accent2: "#7affd0",
    art: "assets/photo/software.jpg",
    artFit: "cover",
    artFallback: "assets/art/software.svg",
    resumePdf: "assets/docs/resume-software.pdf",
    stats: [
      { label: "Frontend", value: 88 },
      { label: "Debugging", value: 86 },
      { label: "Systems Design", value: 80 },
      { label: "APIs", value: 82 },
      { label: "Collaboration", value: 89 },
      { label: "Shipping", value: 85 },
    ],
    skills: ["JavaScript", "React", "Node", "Git", "HTML/CSS", "Python", "Figma"],
    about:
      "Product manager and developer on Triton Software Engineering, building real software for nonprofit clients. I like the seam where an analysis becomes an interactive product.",
    resume: [
      {
        role: "Product Manager",
        org: "Triton Software Engineering",
        when: "2025 – Present",
        start: "2025-09",
        bullets: [
          "Lead a student team building software for nonprofit clients.",
          "Own scope, timeline, and the client relationship.",
        ],
      },
      {
        role: "Developer",
        org: "Triton Software Engineering",
        when: "2024 – 2025",
        start: "2024-09",
        bullets: ["Built client features across the stack as part of a project team."],
      },
      {
        role: "Information Technology Intern",
        org: "Port of Long Beach",
        when: "Jun – Aug 2024",
        start: "2024-06",
        bullets: [
          "Researched the Port's use of Darktrace cybersecurity software; presented findings to the Cybersecurity team and Assistant Director and wrote a formal report.",
          "Developed a Python tool assessing infrastructure impact from a global failure event, tracking offline devices and identifying affected employees.",
          "Service Desk work: ticket resolution, imaging, decommissioning, asset audits, server installs, and switch burn tests.",
        ],
      },
    ],
  },

  research: {
    label: "Researcher",
    rarity: "SR",
    tagline: "Asking the question before trusting the answer.",
    accent: "#ffb0d0",
    accent2: "#ffe08a",
    // A real photo instead of the placeholder figure. `artFit: "cover"` tells
    // the card to fill its frame with it rather than treat it as a cut-out.
    // Falls back to the SVG automatically if the file is not there yet.
    art: "assets/photo/research.jpg",
    artFit: "cover",
    artFallback: "assets/art/research.svg",
    // the "View full resume" button opens this instead of the timeline
    resumePdf: "assets/docs/resume-research.pdf",
    stats: [
      { label: "Study Design", value: 85 },
      { label: "Statistical Inference", value: 89 },
      { label: "Writing", value: 83 },
      { label: "Rigor", value: 90 },
      { label: "Domain Reading", value: 82 },
      { label: "Presenting", value: 84 },
    ],
    skills: ["sPLS", "Mixed Models", "Longitudinal Data", "Wearables", "R", "Cognitive Science"],
    about:
      "Cognitive science research on sleep, wearables, and cognitive aging — the kind of messy longitudinal data where the modeling choices matter as much as the result.",
    resume: [
      {
        role: "Data Science Research Intern",
        org: "Scripps Research DTC — Quer Lab",
        when: "Jun – Aug 2026",
        start: "2026-06",
        bullets: [
          "Investigated whether Fitbit-derived sleep features predict cognitive performance in older women, in the REFRESH-NOW cohort.",
          "Regression, PCA/sPLS feature reduction, and longitudinal mixed-effects modeling of wearable-derived biomarkers.",
          "Integrated Stroop, Trail Making, PASAT, reaction time, and tapping tasks into composite cognitive and sleep measures.",
          "Wrote a manuscript-style scientific report and presented at a research symposium, working toward publication.",
        ],
      },
      {
        role: "Research Intern",
        org: "Scripps Research DTC — Quer Lab & Stuti Jaiswal",
        when: "Fall 2026 – Present",
        start: "2026-09",
        bullets: [
          "Continuing the sleep and cognitive aging work through the school year.",
          "Second study line on delirium and sleep with Stuti Jaiswal.",
        ],
      },
    ],
  },

  leadership: {
    label: "Leadership",
    rarity: "R",
    tagline: "Turning a room of strangers into a team.",
    accent: "#ffd27a",
    accent2: "#ff9d7a",
    art: "assets/photo/leadership.jpg",
    artFit: "cover",
    artFallback: "assets/art/leadership.svg",
    resumePdf: "assets/docs/resume-leadership.pdf",
    stats: [
      { label: "Organizing", value: 91 },
      { label: "Outreach", value: 87 },
      { label: "Communication", value: 86 },
      { label: "Follow-through", value: 88 },
      { label: "Mentorship", value: 85 },
      { label: "Public Speaking", value: 84 },
    ],
    skills: ["Event Design", "Outreach", "Mentorship", "Public Speaking", "Facilitation"],
    about:
      "Resident Advisor and student-org director. Most of the job is getting people in the room and making it worth their time.",
    resume: [
      {
        role: "Director of Professional Events",
        org: "DS3 @ UCSD",
        when: "2024 – Present",
        start: "2024-09",
        bullets: [
          "Source industry guests and run the professional event series.",
          "Write the run of show and keep the room moving.",
        ],
      },
      {
        role: "Resident Assistant",
        org: "Eighth College, UC San Diego",
        when: "Aug 2025 – Jun 2026",
        start: "2025-08",
        bullets: ["Plan community events; first point of contact for a floor of residents."],
      },
      {
        role: "Math Tutor",
        org: "OASIS, UC San Diego",
        when: "Oct 2024 – Present",
        start: "2024-10",
        bullets: [
          "Run drop-in and scheduled precalculus tutoring for undergraduates.",
          "Track progress by identifying learning obstacles and giving targeted feedback.",
          "Explain concepts both algebraically and graphically, tied to where they lead in higher-level math.",
        ],
      },
      {
        role: "Product Manager",
        org: "Triton Software Engineering",
        when: "2025 – Present",
        start: "2025-09",
        bullets: ["Keep a volunteer engineering team shipping on a client timeline."],
      },
    ],
  },
};

/** Order of the tabs across the top of the profile page. */
export const TAB_ORDER = ["data", "software", "research", "leadership"];

/* ---------------------------------------------------------------------------
   PROJECTS — drawn as a constellation. Each project is a star:

     pos   where it sits in the sky, 0–1 on each axis (0,0 = top-left).
           Hand-placed on purpose — a layout algorithm would spread these
           evenly, and evenly is exactly what a constellation is not.
     icon  which glyph goes inside the diamond (see js/icons.js).

   The lines between stars are NOT listed here: js/constellation.js works them
   out with a minimum spanning tree, so every star joins its nearest neighbour
   and no line leaps across the sky. Add a project with a `pos` in an empty
   patch and the shape re-forms around it.
   ------------------------------------------------------------------------- */
export const PROJECTS = [
  {
    name: "San Diego Preservation Fund Targeting Tool",
    short: "SD Preservation Fund",
    category: "Civic Tech · Hackathon",
    year: "2026",
    icon: "building",
    pos: { x: 0.80, y: 0.17 },
    tags: ["Housing", "Geospatial", "Forecasting"],
    blurb:
      "San Diego approved $8.5M in June 2026 to buy naturally-occurring affordable housing before it flips to market rate — and has bought nothing yet. This ranks the acquisition candidates. The fund exists, the money exists; the missing piece was the list.",
    tech: ["Python", "HUD FMR", "Census Tracts"],
    impact: [
      "SDHC estimates ~9,250 naturally-occurring affordable units are vulnerable by 2040",
      "Ranks tracts by current vulnerability against how fast rents are deteriorating",
      "Built at the DSA Building for Good hackathon",
    ],
    link: "https://temporary-quick-spinel-zyqnp7h.vercel.app",
  },
  {
    name: "SignalShield AI — Mission Audio Triage",
    short: "SignalShield",
    category: "Audio ML · Hackathon",
    year: "2026",
    icon: "shield",
    pos: { x: 0.20, y: 0.17 },
    tags: ["Deepfake Detection", "FastAPI", "React"],
    blurb:
      "Detects synthetic speech, acoustic duress, and operational content from uploaded or live audio — a neural model when accuracy matters and a classical one when milliseconds do.",
    tech: ["PyTorch", "FastAPI", "React", "Whisper"],
    impact: [
      "Spectra-AASIST3 baseline: 0.723% EER on ASVspoof19 LA, ~190 ms per clip",
      "MFCC + RBF SVM fallback classifies in ~7 ms",
      "Built at the DS3 Defense Hackathon",
    ],
    link: "https://github.com/Ishayu1/SignalShield",
  },
  {
    name: "Breathing Smoke",
    category: "Data Visualization",
    year: "2026",
    icon: "chart",
    pos: { x: 0.50, y: 0.09 },
    tags: ["D3", "Scrollytelling", "Air Quality"],
    blurb:
      "Every year, Delhi disappears into smog. A scrolling investigation that follows the smoke from stubble fires in Punjab and Haryana to the thirty million people breathing it.",
    tech: ["D3", "JavaScript", "Python"],
    impact: [
      "VIIRS fire detections tracked against Delhi PM2.5",
      "Winter average of 377 µg/m³ — about 25× the WHO guideline",
      "Readers guess the cigarette equivalent before seeing the answer",
    ],
    link: "https://argsweet.github.io/Delhi-Air/",
  },
  {
    name: "League of Legends 15-Minute Statistical Analysis",
    short: "League of Legends Analysis",
    category: "Machine Learning",
    year: "2026",
    icon: "gamepad",
    pos: { x: 0.17, y: 0.70 },
    tags: ["Permutation Testing", "Random Forest", "Fairness"],
    blurb:
      "Can the first 15 minutes decide a professional match? Predicts outcomes from early-game gold, XP, and kill differentials in 2025 Oracle's Elixir competitive data.",
    tech: ["Python", "pandas", "scikit-learn"],
    impact: [
      "Permutation testing on early-game differentials",
      "Random forest classifier plus a fairness analysis",
    ],
    link: "https://argsweet.github.io/League-of-Legends-15-Min-Analysis/",
  },
  {
    name: "A Country on Fire",
    category: "Data Visualization",
    year: "2026",
    icon: "flame",
    pos: { x: 0.13, y: 0.43 },
    tags: ["MODIS", "D3", "Geospatial"],
    blurb:
      "Statewise wildfire intensity (Fire Radiative Power) against fire count, from MODIS satellite detections. The South burns more often; the West burns hotter.",
    tech: ["D3", "Python", "pandas"],
    impact: [
      "Two paired maps: frequency versus intensity",
      "A South/West split that only shows up when you compare them",
    ],
    link: "https://argsweet.github.io/Wildfires/",
  },
  {
    name: "Boston By Bike",
    category: "Interactive Map",
    year: "2026",
    icon: "map",
    pos: { x: 0.87, y: 0.43 },
    tags: ["Mapbox GL", "D3", "Geospatial"],
    blurb:
      "BlueBike traffic across Boston, combining real bike-lane infrastructure with ride data to show how cycling shifts by location, direction, and time of day.",
    tech: ["Mapbox GL", "D3", "GeoJSON"],
    impact: [
      "Time-of-day filter across the whole network",
      "Departure/arrival balance encoded per station",
    ],
    link: "https://argsweet.github.io/Boston-By-Bike/",
  },
  {
    name: "Rotten Tomato Critics Sentiment Analysis",
    short: "Rotten Tomato Sentiment",
    category: "Natural Language Processing",
    year: "2025",
    icon: "speech",
    pos: { x: 0.83, y: 0.70 },
    tags: ["NLP", "Web Scraping", "Sentiment"],
    blurb:
      "Critic reviews versus audience reviews across five films: tone, word frequency, and rating extremity. Are professionals actually more measured than everyone else?",
    tech: ["Python", "NLTK", "BeautifulSoup"],
    impact: [
      "Reviews scraped from Rotten Tomatoes across five films",
      "Critic and audience language compared head to head",
    ],
    link: "",
  },
  {
    name: "Audio Processing & Speech Transcription Limits",
    short: "Audio Processing Limits",
    category: "Python / OOP",
    year: "2025",
    icon: "wave",
    pos: { x: 0.36, y: 0.89 },
    tags: ["OOP", "Audio", "Speech-to-Text"],
    blurb:
      "An AudioProcessor class that bends .wav files with pitch, speed, noise, echo, and trimming — then asks how far you can distort speech before transcription breaks.",
    tech: ["Python", "NumPy", "SciPy"],
    impact: [
      "One class, five transformations",
      "Accuracy tracked as distortion intensity climbs",
    ],
    link: "",
  },
  {
    name: "Mental Illness & Alzheimer's Prediction",
    short: "Alzheimer's Prediction",
    category: "Machine Learning",
    year: "2023",
    icon: "brain",
    pos: { x: 0.64, y: 0.89 },
    tags: ["Classification", "Group Project", "Health"],
    blurb:
      "Can an Alzheimer's diagnosis be predicted from mental illness severity and socio-demographic factors? Random Forest, KNN, and Naive Bayes, compared.",
    tech: ["Python", "scikit-learn", "pandas"],
    impact: [
      "KNN came out ahead at 82.1% accuracy",
      "Age, weight, height, education, and symptom severity as key predictors",
    ],
    link: "",
  },
];

/** Sidebar destinations. `view` matches a data-view value handled in app.js. */
export const NAV = [
  { view: "profile", label: "Profile", icon: "user" },
  { view: "projects", label: "Projects", icon: "grid" },
  { view: "timeline", label: "Timeline", icon: "hourglass" },
  { view: "gallery", label: "Gallery", icon: "image" },
  { view: "about", label: "About", icon: "info" },
  // Archived for now — the Contact view and its renderer are still in place;
  // uncomment this line to bring it back.
  // { view: "contact", label: "Contact", icon: "mail" },
];

/* ---------------------------------------------------------------------------
   ABOUT — the "nice to meet you" page.
   `photo` is a placeholder until you drop a real headshot in assets/.
   ------------------------------------------------------------------------- */
export const ABOUT = {
  kicker: "Nice to meet you!",
  headline: "I'm Annabelle.",
  photo: "assets/photo/data.jpg", // empty would render the placeholder frame instead
  paragraphs: [
    "I'm a Data Science student at UC San Diego passionate about using technology, creativity, and data to create meaningful impact. My interests span software engineering, machine learning, neuroscience, and human-centered design, and I'm always excited by opportunities to learn, build, and collaborate.",
  ],
  blocks: [
    {
      icon: "flask",
      title: "Research & Data",
      text: "Currently interning at Scripps Research, using statistical inference to explore the relationship between sleep and cognitive decline.",
    },
    {
      icon: "people",
      title: "Leadership & Community",
      text: "Director of Professional Events for the Data Science Student Society and Product Manager at Triton Software Engineering, where I enjoy creating spaces for people to connect, learn, and grow.",
    },
    {
      icon: "sparkles",
      title: "Beyond Tech",
      text: "Outside of work, you'll find me rock climbing, performing in musicals, gaming, or trying new creative hobbies like wood carving.",
    },
  ],
};
