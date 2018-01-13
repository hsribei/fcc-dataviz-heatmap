import "./style.css";
import "core-js";
import * as d3 from "d3";

function heatMapColorforValue(value) {
  var h = (1.0 - value) * 240;
  return "hsl(" + h + ", 100%, 50%)";
}

function makeHeatMap(fullData): void {
  const data = fullData.monthlyVariance;
  const margin = { top: 20, right: 20, bottom: 20, left: 100 },
    totalWidth = 1240,
    totalHeight = 400,
    width = totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const parseDate = d3.timeParse("%Y-%m");
  data.forEach(d => {
    d.date = parseDate(`${d.year}-${d.month}`);
  });

  // Massage data into gridData
  const numMonths = 12;
  const numYears = Array.from(new Set(data.map(d => d.year))).length;
  const gridData = [];
  for (let i = 0; i < numMonths; i++) {
    gridData.push([]);
    for (let j = 0; j < numYears; j++) {
      const d = data[j * numMonths + i];
      if (d) {
        gridData[i].push(d);
      }
    }
  }

  // Let there be color
  const normalizeVariance = d3.scaleLinear().range([0, 1]);
  normalizeVariance.domain(d3.extent(data, d => d.variance));
  const color = d => heatMapColorforValue(normalizeVariance(d.variance));

  // Get the bands together! (Draw rectangles)
  const xBand = d3.scaleBand().range([0, width]);
  xBand.domain(Array.from(new Set(data.map(d => d.year))));

  const yBand = d3.scaleBand().range([0, height]);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  yBand.domain(monthNames);

  const row = svg
    .selectAll(".row")
    .data(gridData)
    .enter()
    .append("g")
    .attr("class", "row");

  const column = row
    .selectAll(".heatRect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("class", "heatRect")
    .attr("x", d => xBand(d.year))
    .attr("y", d => yBand(monthNames[d.month - 1]))
    .attr("width", xBand.bandwidth())
    .attr("height", yBand.bandwidth())
    .style("fill", d => color(d));

  // Add the X Axis
  const xTime = d3.scaleTime().range([0, width]);
  xTime.domain(d3.extent(data, d => d.date));
  const xAxis = d3.axisBottom(xTime).tickFormat(d3.timeFormat("%Y"));
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  const yAxis = d3.axisLeft(yBand);
  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);
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

// Bibliography
// * Let's Make a Grid with D3.js: https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
// * Heatmap color for value: https://stackoverflow.com/a/27263918/105132
