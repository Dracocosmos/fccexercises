// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Scatter Plot/D3 Scatter Plot.css"
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

// code under here

// const data = [[1, 2], [2, 4], [3, 6], [2, 6]]

const main = (data) => {
  console.log(data)
  // console.log(data.data[0])
  // data = data.data
  const width = 1100;
  const height = 400;
  const scalePadding = 50;
  const topPadding = 10;

  // scale horizontal
  const xSc = d3.scaleUtc()
    .domain([d3.min(data, (d) => {
      return d[0]
    }), d3.max(data, (d) => {
      return d[0]
    })])
    .range([scalePadding, width - scalePadding]);

  // scale vertical
  const ySc = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d[1]
    })])
    .range([height - scalePadding, topPadding]);

  // main svg
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "lightgrey");

  // plot points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xSc(d[0])
    })
    .attr("cy", (d) => {
      return ySc(d[1])
    })
    .attr('r', 10)
    .style('fill', 'green');
}

// fetches data from localstorage,
// and then from outside site, then runs main program
let data = sessionStorage.getItem("sctPlotData")
if (data === null) {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    // don't know why, but the response has a json function?
    // which gives a js object
    .then(response => {
      const rjson = response.json()
      return rjson
    })
    .catch()
    .then(respData => {
      // save object as json
      sessionStorage.setItem("sctPlotData", JSON.stringify(respData))
      console.log("fetching data")
      main(respData)
    })
    .catch(error => {
      console.error("error fetching data: ", error)
    })
} else {
  console.log("loading data from session storage")
  // load JSON as object
  main(JSON.parse(data))
}
