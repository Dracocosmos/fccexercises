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

// const data = [[1, 2], [2, 4], [3, 6], [2, 6]]

const main = (data) => {
  console.log(data)

  const width = 1100,
    height = 400,
    scalePadding = 50,
    topPadding = 10,
    circleSize = 10,
    parseYear = d3.timeParse("%Y"),
    parseTime = d3.timeParse("%M:%S")

  // scale horizontal
  const xSc = d3.scaleUtc()
    .domain([
      d3.min(data, (d) => {
        return (parseYear(d["Year"]))
      }),
      d3.max(data, (d) => {
        return (parseYear(d["Year"]))
      })])
    .range([scalePadding + circleSize, width - scalePadding]);

  // scale vertical
  const ySc = d3.scaleTime()
    .domain([
      d3.min(data, (d) => {
        // console.log(new Date("0000-01-01T00:" + d["Time"]))
        // console.log(parseTime(d["Time"]))
        // return parseTime(d["Time"])
        return new Date("0000-01-01T00:" + d["Time"])
      }),
      d3.max(data, (d) => {
        // return parseTime(d["Time"])
        return new Date("0000-01-01T00:" + d["Time"])
      })])
    .nice()
    // .domain([
    //   d3.min(data, (d) => {
    //     return d["Seconds"]
    //   }),
    //   d3.max(data, (d) => {
    //     return d["Seconds"]
    //   })])
    .range([height - scalePadding, topPadding])


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

  // title text
  svg.append("text")
    .text("scatter!")
    .attr("x", 100)
    .attr("y", 100)
    .attr("id", "title")

  // plot points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xSc(parseYear(d["Year"]))
    })
    .attr("cy", (d) => {
      // return parseTime(d["Time"])
      return ySc(new Date("0000-01-01T00:" + d["Time"]))
    })
    .attr('r', circleSize)
    .attr('class', "dot")
    .style('fill', 'green');
  // create axis lines
  // TODO: add more ticks down bottom
  svg.append("g")
    .attr("transform", `translate(0,${height - scalePadding})`)
    .call(d3.axisBottom(xSc)
      // otherwise it'll have a tick every 2 years
      // .ticks(d3.utcYear.every(1))
      .ticks(data.length)
      // .ticks(data.map((d) => d["Year"]))
      // .tickFormat(d3.format("d"))
    )
    .attr("id", "x-axis")
  svg.append("g")
    .attr("transform", `translate(${scalePadding},0)`)
    .call(d3.axisLeft(ySc)
      .tickFormat(d3.utcFormat("%M:%S"))
    )
    .attr("id", "y-axis")
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
