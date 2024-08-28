// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Heat Map/D3 Heat Map.css"
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

const main = (data) => {
  console.log(data)
  const baseTemperature = data.baseTemperature
  data = data.monthlyVariance

  const width = 1100,
    height = 300,
    padding = 60,
    topPadding = 10,
    barWidth = (width - padding * 2) / data.length,
    barHeight = (height - topPadding) / 12

  // scale horizontal
  const xSc = d3.scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return d.year
      }),
      d3.max(data, (d) => {
        return d.year
      })
    ])
    .range([padding, width - padding]);

  // scale vertical
  const ySc = d3.scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return d.month
      }),
      d3.max(data, (d) => {
        return d.month
      })
    ])
    .range([height - padding, topPadding])

  // main svg
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "lightgrey")
    .attr("id", 'svg-background')

  // axis lines
  svg.append("g")
    .attr("transform", `translate(0,${height - padding})`)
    .attr("id", "x-axis")
    .call(d3.axisBottom(xSc)
      .tickFormat((d) => d.toString())
    )
  svg.append("g")
    .attr("transform", `translate(${padding},0)`)
    .attr("id", "y-axis")
    .call(d3.axisLeft(ySc)
      .tickFormat((d) => {
        const date = new Date()
        // -1 because 0 indexed, you dumb
        date.setMonth(d - 1)
        return date.toLocaleString(undefined, { month: 'long' })
      })
    )

  // data points
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr('width', barWidth)
    .attr('height', barHeight)
    .style('fill', 'blue')
    .attr('x',)
}

// fetches data from localstorage,
// and then from outside site, then runs main program
let data = sessionStorage.getItem("heatMapData")
if (data === null) {
  console.log("fetching data")
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    // don't know why, but the response has a json function?
    // which gives a js object
    .then(response => {
      const rjson = response.json()
      return rjson
    })
    .catch()
    .then(respData => {
      // save object as json
      sessionStorage.setItem("heatMapData", JSON.stringify(respData))
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
