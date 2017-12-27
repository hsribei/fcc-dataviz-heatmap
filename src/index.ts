import "./style.css";
import * as d3 from "d3";

function makeHeatMap(fullData): void {
  const data = fullData.monthlyVariance;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 },
    totalWidth = 1024,
    totalHeight = 768,
    width = totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

function fetchAndExecuteWithJson(
  url: string,
  jsonConsumer: (json: object) => void
): void {
  fetch(url).then(response => response.json().then(jsonConsumer));
}

document.addEventListener("DOMContentLoaded", event => {
  const url =
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  fetchAndExecuteWithJson(url, makeHeatMap);
});
