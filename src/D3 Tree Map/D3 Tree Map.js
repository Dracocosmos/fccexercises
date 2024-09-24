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

  // unique ids for clip path,
  // identifier must be letters only
  let uids = {}
  const getUid = (identifier) => {
    uids[identifier]
      ? ++uids[identifier]
      : uids[identifier] = 1
    return identifier + '-' + uids[identifier]
  }
  // calculate bottom margin height:
  const legendTitlesRowHeight = 20,
    bottomLegendSpace = data.children.length / 2 * legendTitlesRowHeight

  console.log(data)

  // Specify the color scale.
  const color = d3.scaleOrdinal(
    data.children.map(d => {
      return d.name
    }),
    d3.schemeSet3
  );

  // svg container
  const svg = d3.select("#root")
    .append("svg")
    // .attr("viewBox", [0, 0, width, height])
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2 + bottomLegendSpace)
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
  const
    titlesHalf = Math.floor(data.children.length / 2) - 1,
    titlesSeparatingMargin = 150,
    colorWidth = 100

  const legendWrapper = svg.append('g')
    .attr('id', 'legend')
    .attr("transform",
      `translate(${(width / 2) + (colorWidth / 2)}
        ,${margin * 2 + height})`
    )

  // add locations for legend data 
  const legendLeaf = legendWrapper.selectAll('g .legend-leaf')
    .data(data.children)
    .join("a")
    .attr("transform", (_d, i) => {
      return `translate(
        ${i > titlesHalf
          ? '-' + titlesSeparatingMargin
          : titlesSeparatingMargin},
        ${i > titlesHalf
          ? (i - 1 - titlesHalf) * legendTitlesRowHeight
          : i * legendTitlesRowHeight}
        )`
    })

  // add text to legend
  legendLeaf.append('text')
    .text(d => {
      return d.name
    })
    .attr('class', 'legend-text')

  // add color to legend
  legendLeaf.append('rect')
    .attr('width', colorWidth)
    .attr('height', 10)
    .attr('fill', (d, i) => {
      return color(d.name)
    })
    .attr('x', -colorWidth - 2)
    .attr('y', -legendTitlesRowHeight / 2)
    .attr('class', 'legend-item')

  // tooltip
  const tooltip = d3.select('body')
    .append('tooltip')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('background-color', 'rgba(239,239,239, 0.7)')
    .style('position', 'absolute')
    .style('display', 'none')
    .style('padding', '3px')
    .style('border-radius', '5px')
    // make it not block mouse events
    .style("pointer-events", "none")

  // For hovering tooltip
  const mouseMove = (e) => {
    const data = e.target.attributes

    if (data['data-name'] === undefined) {
      return
    }

    // modify tooltip text and location
    tooltip
      .style("left", `${e.layerX - 60}px`)
      .style("top", `${e.layerY + 20}px`)
      .html(`
        <span>Name: ${data['data-name'].value}</span>
        <br/>
        <span>Category: ${data['data-category'].value}</span>
        <br/>
        <span>Value: ${data['data-value'].value}</span>
      `)
      // .attr('data-education', countyE.attributes['data-education'].value)
      .attr('',)
  }

  const onHover = (_e, d) => {
    document.addEventListener('mousemove', mouseMove, false);

    // show tooltip
    tooltip
      .style('display', 'inline')
      // data-education needs to be here so that it passes tests?
      // wanted it in the mousemove, but nope
      .attr('data-name', d.data.name)
      .attr('data-category', d.data.category)
      .attr('data-value', d.data.value)
  }
  const onLeave = (_e, _d) => {
    document.removeEventListener('mousemove', mouseMove, false);

    // vanish tooltip
    tooltip
      .style('display', 'none')
  }

  // Compute the layout.
  const root = d3.treemap()
    // .tile(d3.treemapResquarify) // any treemapping function here
    .size([width, height])
    (d3.hierarchy(data)
      .sum(d => {
        return d.value
      })
      .sort((a, b) => {
        return b.value - a.value
      })
    )

  // Add a cell for each leaf of the hierarchy
  const leaf = svg.selectAll("g .leaf")
    .data(root.leaves())
    .join("a")
    .attr("transform", d => {
      return `translate(${d.x0 + margin},${d.y0 + margin})`
    })
    .attr('x', d => console.log(d))

  // Append a color rectangle. 
  leaf.append("rect")
    .attr("id", d => {
      const id = getUid('leaf')
      d.leafUid = id
      return id
    })
    .attr("fill", d => {
      return color(d.parent.data.name)
    })
    .attr('stroke', 'white')
    .attr("fill-opacity", 0.6)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr('class', 'tile')
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .on('mouseover', onHover)
    .on('mouseout', onLeave)

  // Append a clipPath to ensure text does not overflow.
  leaf.append("clipPath")
    .attr("id", d => {
      const uid = getUid('clip')
      d.clipUid = uid
      return uid
    })
    .append("use")
    .attr("href", d => {
      return '#' + d.leafUid
    });

  leaf.append("text")
    .attr("clip-path", d => {
      return 'url(#' + d.clipUid + ')'
    })
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(d.value))
    .join("tspan")
    .attr('font-size', (_d, _i, _nodes) => {
      return '80%'
    })
    .attr("x", 3)
    .attr("y", (_d, i, _nodes) => {
      return i + 1 + 'em'
      // original copied formula:
      // return `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    })
    .attr("fill-opacity", (_d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
    .text(d => d)
    .style("pointer-events", "none")

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

    // clear previous svg
    $('#svg-container').remove()
    $('#tooltip').remove()

    // create new svg
    drawSvg(e.data)
  }

  // button for every data source
  [kickstarterData, movieData, gameData].forEach((data) => {
    buttonDiv.append($(document.createElement('button'))
      .attr('id', data['button-name'].toLowerCase() + '-button')
      .attr('class', 'data-change-button')
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
