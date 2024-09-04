// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Choropleth Map/D3 Choropleth Map.css"
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
import * as topojson from "topojson-client";

// main program
const main = (eduData, mapData) => {
  console.log(eduData)
  console.log(mapData)

  const nationData = topojson.feature(mapData, mapData.objects.nation)
  const stateData = topojson.feature(mapData, mapData.objects.states)
  const countyData = topojson.feature(mapData, mapData.objects.counties)

  // let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  // let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const width = 1000,
    height = 400;

  // svg container
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "title")

  // geoIdentity() projection just to get a projection going
  // so I can scale etc.
  const projection = d3.geoIdentity()
    .fitSize([width, height], nationData)

  // Draw the counties
  svg.selectAll()
    .data(countyData.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", (d) => {
      return "lightcoral"
    })
    .style('fill', "white")

  // Draw the states
  svg.selectAll()
    .data(stateData.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", (d) => {
      return "grey"
    })
    .style('fill', "white")
    .style('fill-opacity', "0")

  // Draw the map
  svg.append("path")
    .datum({ type: "FeatureCollection", features: nationData.features })
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", (d) => {
      return "black"
    })
    .style('fill', "white")
    .style('fill-opacity', "0")
}

// fetches data from localstorage,
// and then from outside site
const fetchData = (url, storageName) => {
  return new Promise((resolve, reject) => {
    let data = sessionStorage.getItem(storageName)
    // if data is not in sessionStorage, fetch it
    if (data === null) {
      console.log("fetching " + storageName)
      fetch(url)
        // don't know why, but the response has a json function?
        // which gives a js object
        .then(response => {
          const rjson = response.json()
          return rjson
        })
        .then(respData => {
          // save object as json
          sessionStorage.setItem(storageName, JSON.stringify(respData))
          resolve(respData)
        })
        .catch(error => {
          console.error("error fetching " + storageName + ", ", error)
          reject(error)
        })
    } else {
      console.log("loading " + storageName + " from session storage")
      try {
        // load JSON as object
        data = JSON.parse(data)
        resolve(data)
      } catch (error) {
        console.error("failed parsing" + storageName + ", ", error)
        reject(error)
      }
    }
  });
};

const eduData = fetchData(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
  'choroplethEduData'
)
const mapData = fetchData(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
  'choroplethMapData'
)

Promise.all([eduData, mapData])
  .then((values) => {
    main(values[0], values[1])
  })
