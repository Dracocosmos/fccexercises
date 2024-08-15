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

// data location: 
// https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json

const main = (data) => {
  console.log(data.data)
  console.log(data.data[0])
  data = data.data
  const width = 1100;
  const height = 400;
  const scalePadding = 50;
  const topPadding = 5;
  const barGap = 0;
  const barWidth = Math.round(width / data.length - barGap)

  // scale horizontal
  const xSc = d3.scaleUtc()
    .domain([d3.min(data, (d) => {
      return new Date(d[0])
    }), d3.max(data, (d) => {
      return new Date(d[0])
    })])
    .range([scalePadding, width - scalePadding]);

  // scale vertical
  const ySc = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d[1]
    })])
    .range([height - scalePadding, topPadding]);

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
    .attr("x", (d, _i) => {
      return xSc(new Date(d[0]))
    })
    .attr("y", (d) => {
      return ySc(d[1])
    })
    .attr("width", barWidth)
    .attr("height", (d) => {
      return height - (ySc(d[1]) + scalePadding)
    })
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])

  // add tooltip
  const tooltipNode = document.createElement('tooltip');
  $("body").append(tooltipNode)
  tooltipNode.classList.add("tooltip")
  tooltipNode.setAttribute("id", "tooltip")
  // get location and data for tooltip
  svg.selectAll("rect")
    // document.getElementById("hi").sty
    .on("mouseover", (t) => {
      const tipDataDate = t.originalTarget.getAttribute("data-date")
      tooltipNode.classList.add("tooltip-hover")
      tooltipNode.innerText = tipDataDate
      tooltipNode.setAttribute("data-date", tipDataDate)
      tooltipNode.style.left = (t.clientX + 10) + "px"
      tooltipNode.style.top = (t.clientY - 20) + "px"
    })
    .on("mouseout", (_t) => {
      tooltipNode.classList.remove("tooltip-hover")
    })

  // create axis lines
  svg.append("g")
    .attr("transform", `translate(0,${height - scalePadding})`)
    .call(d3.axisBottom(xSc))
    .attr("id", "x-axis")
  svg.append("g")
    .attr("transform", `translate(${scalePadding},0)`)
    .call(d3.axisLeft(ySc))
    .attr("id", "y-axis")
}

// fetches data from localstorage,
// and then from outside site, then runs main program
let data = sessionStorage.getItem("barChData")
if (data === null) {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    // don't know why, but the response has a json function?
    // which gives a js object
    .then(response => {
      const rjson = response.json()
      return rjson
    })
    .catch()
    .then(respData => {
      // save object as json
      sessionStorage.setItem("barChData", JSON.stringify(respData))
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
