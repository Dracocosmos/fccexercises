// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Bar Chart/D3 Bar Chart.css"
// for resetting to the exercise menu
import Reset from "../Reset";
ReactDOM.render(
  <div>
    <Reset></Reset>
  </div>,
  $("#root")[0]
);

import $ from "jquery";

import * as d3 from "d3"

const data = [1, 2, 3, 3, 2, 1, 4]
// data location: 
// https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json

// fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data)
//   })

const width = 400;
const height = 100;
const scalePadding = 30;

// scale horizontal
const xSc = d3.scaleLinear()
  .domain([0, data.length])
  .range([scalePadding, width - scalePadding]);

// scale vertical
const ySc = d3.scaleLinear()
  .domain([0, d3.max(data, (d) => d)])
  .range([height - scalePadding, 5]);

// Create a SVG container.
const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("id", "title")

// create bars
svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (_d, i) => xSc(i))
  .attr("y", (d) => ySc(d))
  .attr("width", Math.round(width / data.length - 15))
  .attr("height", (d) => height - (ySc(d) + scalePadding))
  .attr("class", "bar")

// create axis lines
svg.append("g")
  .attr("transform", `translate(0,${height - scalePadding})`)
  .call(d3.axisBottom(xSc))
  .attr("id", "x-axis")
svg.append("g")
  .attr("transform", `translate(${scalePadding},0)`)
  .call(d3.axisLeft(ySc))
  .attr("id", "y-axis")

