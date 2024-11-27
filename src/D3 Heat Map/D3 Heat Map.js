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
    padding = 10,
    leftPadding = 70 + padding,
    rightPadding = 10 + padding,
    topPadding = 35 + padding,
    bottomPadding = 40 + padding,
    barWidth = (width - (rightPadding + leftPadding)) /
      (d3.max(data, (d) => {
        return d.year
      }) -
        d3.min(data, (d) => {
          return d.year
        })
      ),
    // why this works with padding instead of topPadding I have no clue
    barHeight = (height - padding - bottomPadding) / 12

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
    .range([leftPadding, width - rightPadding]);

  // scale vertical
  const ySc = d3.scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return d.month - 1
      }),
      d3.max(data, (d) => {
        return d.month - 1
      })
    ])
    .range([height - bottomPadding, topPadding])

  // scale colour
  const colours = (value) => {
    const colorFunction = value < 0.5
      ? d3.interpolateLab("steelblue", "yellow")
      : d3.interpolateLab("yellow", "brown")
    return colorFunction(value)
  }
  const cSc = d3.scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return d.variance
      }),
      d3.max(data, (d) => {
        return d.variance
      })
    ])
    .range([0, 1])

  // main svg
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    // svg is inline default
    .style('display', 'block')
    .style('margin', 'auto')

  // background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "lightgrey")
    .attr("id", 'svg-background')

  // title
  svg.append('text')
    .text('Heat Map')
    .attr('x', 50)
    .attr('y', topPadding / 2 - 5)
    .attr("id", "title")

  // description 
  svg.append('text')
    .text(`Base Temperature: ${baseTemperature}C`)
    .attr('x', 20)
    .attr('y', height - padding)
    .attr("id", "description")

  // axis lines
  svg.append("g")
    .attr("transform", `translate(0,${height - bottomPadding + 1})`)
    .attr("id", "x-axis")
    .call(d3.axisBottom(xSc)
      .tickFormat((d) => d.toString())
    )
  svg.append("g")
    .attr("transform", `translate(${leftPadding - 1},0)`)
    .attr("id", "y-axis")
    .call(d3.axisLeft(ySc)
      .tickFormat((d) => {
        const date = new Date()
        date.setMonth(d)
        return date.toLocaleString('en-US', { month: 'long' })
      })
    )
    // change tick position
    .selectAll(".tick text")
    .attr("transform", `translate(7,-7)`)

  // legend
  const legendColours = [
    colours(0),
    colours(0.2),
    colours(0.4),
    colours(0.6),
    colours(0.8),
    colours(1),
  ]
  const legendWidth = 200
  const legendColourWidth = legendWidth / legendColours.length
  const legendHeight = 20
  svg.append('g')
    .attr('id', 'legend')
    .attr("transform",
      `translate(${width - legendWidth - 20}, ${height - legendHeight - padding})`)
    .selectAll('rect')
    .data(legendColours)
    .enter()
    .append('rect')
    .attr('width', legendColourWidth)
    .attr('height', legendHeight)
    .attr('x', (_d, i) => legendColourWidth * i)
    .attr('y', 0)
    .style('fill', (d) => {
      return d
    })
    .attr("class", "legend-color-box")

  // tooltip
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
    const date = new Date()
    date.setMonth(d.month - 1)
    const month = date.toLocaleString('en-US', { month: 'long' })
    tooltip
      .html(d.year + '<br />' +
        d.variance + '<br />' +
        month)
      // make box visible
      .style('display', 'inline')
      // change box location
      .style("left", `${e.layerX + 25}px`)
      .style("top", `${e.layerY + 25}px`)
      .attr("data-year", d["year"])
  }
  const mouseLeave = (e, d) => {
    tooltip
      .style('display', 'none')
  }

  // data points
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr('width', barWidth)
    .attr('height', barHeight)
    .style('fill', (d) => {
      return colours(cSc(d.variance))
    })
    .attr('x', (d) => {
      return xSc(d.year)
    })
    .attr('y', (d) => {
      return ySc(d.month)
    })
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance)
    .on('mouseover', mouseOver)
    .on('mouseleave', mouseLeave)


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
