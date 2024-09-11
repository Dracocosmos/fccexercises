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

  // fips in eduData matches with id
  // in mapData/counties, make object with
  // fips as keys
  const eduObject = {};
  eduData.map((d, _i) => {
    eduObject[d.fips] = d
  })

  // make data into geojson
  const nationData =
    topojson.feature(mapData, mapData.objects.nation)
  const stateData =
    topojson.feature(mapData, mapData.objects.states)
  const countyData =
    topojson.feature(mapData, mapData.objects.counties)

  // let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  // let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  // values
  const width = 1000,
    height = 600,
    margin = 30,
    eduDataMax =
      d3.max(eduData, (d) => {
        return d.bachelorsOrHigher
      }),
    eduDataMin =
      d3.min(eduData, (d) => {
        return d.bachelorsOrHigher
      })

  // color scale
  const colors = (value) => {
    const colorFunction = value < 0.5
      ? d3.interpolateLab("steelblue", "yellow")
      : d3.interpolateLab("yellow", "brown")
    return colorFunction(value)
  }
  const cSc = d3.scaleLinear()
    .domain([
      eduDataMax,
      eduDataMin
    ])
    .range([0, 1])


  // svg container
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .attr("id", "svg-container")
    // center
    .style('display', 'block')
    .style('margin', 'auto')

  // background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "khaki")
    .attr("id", 'svg-background')

  // title
  svg.append('text')
    .text('Percentage of population with a bachelors degree or higher')
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
  // legend values
  const legendColors = [
    colors(1),
    colors(0.8),
    colors(0.6),
    colors(0.4),
    colors(0.2),
    colors(0),
  ],
    legendWidth = 200,
    legendColorWidth = legendWidth / legendColors.length,
    legendHeight = 20

  // legend scale
  const lSc = d3.scaleLinear()
    .domain([
      eduDataMax,
      eduDataMin
    ])
    .range([
      legendWidth - 1 - (legendColorWidth / 2),
      legendColorWidth / 2
    ])
  const legend = svg.append('g')
    .attr('id', 'legend')
    .attr("transform",
      `translate(${width - legendWidth - 20}, 
        ${margin / 2})`)

  // legend boxes
  legend.selectAll('rect')
    .data(legendColors)
    .enter()
    .append('rect')
    .attr('width', legendColorWidth)
    .attr('height', legendHeight)
    .attr('x', (_d, i) => legendColorWidth * i)
    .attr('y', 0)
    .style('fill', (d) => {
      return d
    })
    .attr("class", "legend-color-box")

  // legend axis
  const ticksAmount = legendColors.length - 1,
    tickStep = (eduDataMax - eduDataMin) / (ticksAmount),
    step = tickStep
  legend.append("g")
    .attr("transform", `translate(0,${-1})`)
    .attr("width", `${legendColorWidth / legendColors.length - 20}`)
    .attr("id", "legend-axis")
    .style("color", 'white')
    .call(d3.axisBottom(lSc)
      .tickValues(
        d3.range(eduDataMin, eduDataMax + step, step)
      )
    )


  // on clicking the map
  const onClick = (e, d) => {
    const countyData = eduObject[d.id]

    // get elements from where clicked
    const elements = document.elementsFromPoint(e.clientX, e.clientY)
    const countyE = elements.find((e, _i) => {
      return e.classList.contains('county')
    })
    const stateE = elements.find((e, _i) => {
      return e.classList.contains('state')
    })

    console.log('county: ', countyE)
    console.log('state: ', stateE)
  }

  // For hovering tooltip
  const mouseMove = (e) => {
    // const countyData = eduObject[d.id]

    // get elements from where clicked
    const elements = document.elementsFromPoint(e.clientX, e.clientY)
    const countyE = elements.find((e, _i) => {
      return e.classList.contains('county')
    })

    if (countyE === undefined) {
      return
    }
    // get data for county under mouse
    const countyData = eduObject[countyE.attributes['data-fips'].value]

    console.log()
  }

  const onHover = (_e, _d) => {
    document.addEventListener('mousemove', mouseMove, false);
  }
  const onLeave = (_e, _d) => {
    document.removeEventListener('mousemove', mouseMove, false);
  }

  // Draw Map
  //
  // geoIdentity() projection just to get a projection going
  // so I can scale etc.
  const projection = d3.geoIdentity()
    .fitExtent(
      [[margin, margin], [width + margin, height + margin]],
      nationData
    )

  // Draw the counties
  svg.selectAll()
    .data(countyData.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", (d) => {
      return "Indigo"
    })
    .style("stroke-width", "0.2")
    .style('fill', (d) => {
      const county = eduObject[d.id]
      return colors(cSc(county.bachelorsOrHigher))
    })
    .on('click', onClick)
    .attr('class', 'county')
    .attr('data-fips', (d) => {
      const county = eduObject[d.id]
      return county.fips
    })
    .attr('data-education', (d) => {
      const county = eduObject[d.id]
      return county.bachelorsOrHigher
    })
    .attr('data-state', (d) => {
      const county = eduObject[d.id]
      return county.state
    })

  // Draw the states
  svg.selectAll()
    .data(stateData.features)
    .join("path")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", (d) => {
      return "DarkKhaki"
    })
    .style("stroke-width", "0.7")
    .style('fill', "white")
    .style('fill-opacity', "0")
    // .attr('pointer-events', 'none')
    .attr('class', 'state')

  // Draw the map
  svg.append("path")
    .datum({
      type: "FeatureCollection",
      features: nationData.features
    })
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", (d) => {
      return "black"
    })
    .style('fill', "white")
    .style('fill-opacity', "0")
    // .attr('pointer-events', 'none')
    .on('click', onClick)
    .on('mouseover', onHover)
    .on('mouseout', onLeave)
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
