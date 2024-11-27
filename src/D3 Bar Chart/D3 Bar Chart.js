// no top level await in codepen!
import React from "react";
import ReactDOM from "react-dom";
// for hot loading css
import "../../Public/D3 Bar Chart/D3 Bar Chart.css"
// for resetting to the exercise menu
import Reset from "../Reset";

import $ from "jquery";

import * as d3 from "d3"

const width = 928;
const height = 500;

d3.select("body")
  .text("hi")

// scales
const scY = d3.scaleLinear()
const scX = d3.scaleLinear()

ReactDOM.render(
  <div>
    <Reset></Reset>
  </div>,
  $("#root")[0]
);
