console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add("current");

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "contact/", title: "Contact Me" },
  { url: "https://github.com/Argsweet", title: "Github" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/" // Local server
    : "/portfolio/"; // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !url.startsWith("http") ? BASE_PATH + url : url;

  // nav.insertAdjacentHTML("beforeend", `<a href="${url}">${title}</a>`);
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  nav.append(a);
}

// <li><a href="https://github.com/Argsweet" target="_blank">Github</a></li>

// Dark mode implementation

document.body.insertAdjacentHTML(
  "afterbegin",
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value='light dark'> Automatic </option>
            <option value='light'> Light </option>
            <option value='dark'> Dark </option>
		</select>
	</label>`,
);

const select = document.querySelector(".color-scheme");

select.addEventListener("input", function (event) {
  console.log("color scheme changed to", event.target.value);
  document.documentElement.style.setProperty(
    "color-scheme",
    event.target.value,
  );
  localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
  const saved = localStorage.colorScheme;
  document.documentElement.style.setProperty("color-scheme", saved);
  select.value = saved;
}

const form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
  event.preventDefault();
  const data = new FormData(form);

  let params = [];

  for (let [name, value] of data) {
    console.log(name, value);
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = form.action + "?" + params.join("&");

  location.href = url;
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
  }
}

export function renderProjects(project, containerElement, headingLevel = "h2") {
  if (!containerElement) {
    console.error("Container not found");
    return;
  }

  const validHeadings = ["h1", "h2", "h3", "h4", "h5", "h6"];

  if (!validHeadings.includes(headingLevel)) {
    console.warn(`Invalid headingLevel "${headingLevel}", defaulting to h2`);
    headingLevel = "h2";
  }

  containerElement.innerHTML = "";

  for (let p of project) {
    const article = document.createElement("article");

    const titleHTML = `<${headingLevel}>${p.title}</${headingLevel}>`;
    const imgHTML = `<img src="${p.image}" alt="${p.title}">`;

    article.innerHTML = `
      <${headingLevel}>${p.title}</${headingLevel}>
  ${p.url ? `<a href="${p.url}" target="_blank">${imgHTML}</a>` : imgHTML}
        <div>
    <p>${p.description}</p>
    <p class="project-year"><em>${p.year}</em></p>
  </div>

    `;

    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

// write javascript that will allow dynamic heading levels based on previous function
