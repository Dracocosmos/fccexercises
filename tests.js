// var babel = require("@babel/core");
import { transform } from "@babel/core";
// import * as babel from "@babel/core";
babel.transform(
  "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js",
  {},
  function (err, result) {
    console.log(result.map);
    result.code;
  },
);
