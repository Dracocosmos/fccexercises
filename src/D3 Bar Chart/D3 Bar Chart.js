// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Bar Chart/D3 Bar Chart.css"
// for resetting to the exercise menu
import Reset from "../Reset";

import $ from "jquery";

import * as d3 from "d3"

const data = [1, 2, 3]

const width = 400;
const height = 200;

// Create a SVG container.
const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("background-color", "blue")

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => {
    return i * 30
  })
  .attr("y", (d) => height - d * 10)
  .attr("width", 25)
  .attr("height", (d) => d * 10)

ReactDOM.render(
  <div>
    <Reset></Reset>
  </div>,
  $("#root")[0]
);
