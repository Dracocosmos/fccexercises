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

// main program
const main = (eduData, mapData) => {
  console.log(eduData)
  console.log(mapData)

  const width = 1000,
    height = 500;

  // svg container
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "title")
  // Draw the map
  // svg.append("path")
  //   .datum({ type: "GeometryCollection", features: mapData.objects.nation })
  //   .attr("d", (d) => {
  //     console.log(d3.geoPath(d))
  //     return d3.geoPath(d.features)
  //   })
  //   // .attr("d", d3.geoPath())
  //   .style("stroke", (d) => {
  //     console.log(d)
  //     return "blue"
  //   })
  svg.append("g")
    .selectAll("path")
    .data(mapData.objects.nation)
    // .data(mapData.objects.nation.geometries)
    .enter()
    .append("path")
    .attr("fill", (d) => {
      console.log(d)
      return "#69b3a2"
    })
    // .attr("d", (d) => { return d3.path(d.features) })
    .attr("d", d3.geoPath())
    .style("stroke", (d) => {
      console.log(d)
      return "#fff"
    })
  // .attr('width', '100%')
  // .attr('height', '100%')
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
