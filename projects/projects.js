import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON("../lib/projects.json");

const projectsContainer = document.querySelector(".projects");

renderProjects(projects, projectsContainer, "h2");

const title = document.querySelector(".projects-title");

title.textContent = `${projects.length} Projects`;

// d3 onwards
let query = "";
let searchInput = document.querySelector(".searchBar");
let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select("#projects-pie-plot");
  svg.selectAll("path").remove();

  let legend = d3.select(".legend");

  legend.selectAll("li").remove();

  arcs.forEach((arc, i) => {
    svg
      .append("path")
      .attr("d", arc)
      .attr("fill", colors(i))
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll("path")
          .attr("class", (_, idx) => (idx === selectedIndex ? "selected" : ""));

        legend
          .selectAll("li")
          .attr("class", (_, idx) =>
            idx === selectedIndex ? "legend-item selected" : "legend-item",
          );

        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, "h2");
        } else {
          let filtered = projectsGiven.filter((p) => {
            let matchesYear = p.year === data[selectedIndex].label;
            let matchesQuery = Object.values(p)
              .join("\n")
              .toLowerCase()
              .includes(query.toLowerCase());
            return matchesYear && matchesQuery;
          }); // click handler
          renderProjects(filtered, projectsContainer, "h2");
        }
      });
  });

  data.forEach((d, idx) => {
    legend
      .append("li")
      .attr("class", "legend-item")
      .attr("style", `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}
// render on page load
renderPieChart(projects);

searchInput.addEventListener("input", (event) => {
  query = event.target.value;
  //search bar listener
  // filter by search query AND selected year at the same time
  let filteredProjects = projects.filter((project) => {
    let matchesQuery = Object.values(project)
      .join("\n")
      .toLowerCase()
      .includes(query.toLowerCase());
    let matchesYear =
      selectedIndex === -1 || project.year === data[selectedIndex].label;
    return matchesQuery && matchesYear;
  });
  renderProjects(filteredProjects, projectsContainer, "h2");
  renderPieChart(filteredProjects);
});
