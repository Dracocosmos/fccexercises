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
  const xSc = d3.scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return d["Year"]
      }),
      d3.max(data, (d) => {
        return d["Year"]
      })
    ])
    .range([scalePadding + circleSize, width - scalePadding]);

  // scale vertical
  const ySc = d3.scaleTime()
    .domain([
      d3.min(data, (d) => {
        return new Date("1900-01-01T00:" + d["Time"])
      }),
      d3.max(data, (d) => {
        return new Date("1900-01-01T00:" + d["Time"])
      })
    ])
    .range([height - scalePadding, topPadding])

  // main svg
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('id', 'svg')
    .style("margin-left", "5vw")

  // background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "lightgrey")
    .attr("id", 'svg-background')

  // title text
  svg.append("text")
    .text("scatter!")
    .attr("x", 100)
    .attr("y", 100)
    .attr("id", "title")

  // legend
  svg.append('text')
    .text('Doping is normal')
    .attr("width", "100%")
    .attr("x", 10)
    .attr('y', height - circleSize)
    .attr('id', 'legend')

  // on hover tooltip 
  const tooltip = d3.select('body')
    .append('rect')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('display', 'none')
    .style("width", "200px")

  // mouseover for points
  // it passes both event and data? don't know where that's defined.
  const mouseOver = (e, d) => {
    tooltip
      .html(() => {
        // creates a data entry from string given
        const entry = (str) => {
          const returnString =
            '<span class="tooltip-label">' +
            str + ': ' +
            '</span>' +
            '<span class="tooltip-data">' +
            d[str] +
            '</span>' +
            '<br />'
          return returnString
        }
        // these are the data entries that get entered,
        // order matters
        const showThese = [
          'Name',
          'Nationality',
          'Time',
          'Place',
          'Year',
          'Doping'
        ]
        // join with nothing, the <br /> in entry() ends entries
        return showThese.map((string) => entry(string)).join('')
      })
      // make box visible
      .style('display', 'inline')
      // change box location
      .style("left", `${e.layerX + 25}px`)
      .style("top", `${e.layerY + 25}px`)
      .attr("data-year", d["Year"])
  }
  const mouseLeave = (e, d) => {
    tooltip
      .style('display', 'none')
  }


  // plot points
  const circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xSc(d["Year"])
    })
    .attr("cy", (d) => {
      return ySc(new Date("1900-01-01T00:" + d["Time"]))
    })
    .attr('r', circleSize)
    .attr('class', "dot")
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => {
      let date = new Date("1900-01-01T00:" + d["Time"])
      // for some reason this needs to be formatted
      return date.toISOString()
    })
    .on('mouseover', mouseOver)
    .on('mouseleave', mouseLeave)
    .style('fill', 'green');


  // create axis lines
  svg.append("g")
    .attr("transform", `translate(0,${height - scalePadding + circleSize})`)
    .call(d3.axisBottom(xSc)
      // otherwise it'll have a tick every half year
      .ticks(data.length / 2)
      .tickFormat((d) => d.toString())
    )
    .attr("id", "x-axis")
  svg.append("g")
    .attr("transform", `translate(${scalePadding},0)`)
    .call(d3.axisLeft(ySc)
      .tickFormat(d3.timeFormat("%M:%S"))
    )
    .attr("id", "y-axis")
}

// fetches data from localstorage,
// and then from outside site, then runs main program
let data = sessionStorage.getItem("sctPlotData")
if (data === null) {
  console.log("fetching data")
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
