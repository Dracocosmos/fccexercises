// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Tree Map/D3 Tree Map.css"
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

// values
const width = 1000,
  height = 600,
  margin = 30,
  fullWidth = width + margin * 2

const drawSvg = (data) => {
  const dataEntries = data.children
  console.log(data)


  // svg container
  const svg = d3.select("#root")
    .append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .attr("id", "svg-container")

  // background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "DarkSeaGreen")
    .attr("id", 'svg-background')

  // title
  svg.append('text')
    .text(data.name)
    .attr('x', 100)
    .attr('y', margin / 2 + 10)
    .attr("id", "title")

  // description 
  svg.append('text')
    .text(`I describe things`)
    .attr('x', 20)
    .attr('y', height + margin * 2 - 10)
    .attr("id", "description")

  // legend
}

const main = (kickstarterData, movieData, gameData) => {

  console.log(kickstarterData)
  console.log(movieData)
  console.log(gameData)

  kickstarterData['button-name'] = 'Kickstarter'
  movieData['button-name'] = 'Movies'
  gameData['button-name'] = 'Games'

  // create svg change buttons
  const rootE = $('#root')

  const buttonDiv = $(document.createElement('div'))
    .attr('id', 'button-wrapper')
    .css('width', fullWidth)
    .appendTo(rootE);

  // on pressing a button
  const buttonClick = (e) => {
    e.preventDefault()

    // TODO: clear svg

    //create new svg
    drawSvg(e.data)
  }

  // button for every data source
  [kickstarterData, movieData, gameData].forEach((data) => {
    buttonDiv.append($(document.createElement('button'))
      .attr('id', data['button-name'].toLowerCase() + '-button')
      .text(data['button-name'])
      .on('click', data, buttonClick)
    )
  })

  // choose which svg to draw by default
  drawSvg(gameData)
}

// fetches data from session storage,
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

const kickstarterData = fetchData(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
  'treeMapKickstarterData'
)
const movieData = fetchData(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
  'treeMapMovieData'
)
const gameData = fetchData(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
  'treeMapGameData'
)

// run main program
Promise.all([kickstarterData, movieData, gameData])
  .then((values) => {
    main(values[0], values[1], values[2])
  })