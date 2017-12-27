import "./style.css";

function makeHeatMap(fullData): void {
  const data = fullData.monthlyVariance;
  console.log(data.length);
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
