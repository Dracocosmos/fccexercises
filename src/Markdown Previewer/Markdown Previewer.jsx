import reactDom from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import exerciseStore from "../exerciseStore";
import Reset from "../Reset";

reactDom.render(
  <Provider store={exerciseStore}>
    <h1>Markdown Previewer</h1>
    <Reset></Reset>
  </Provider>,
  document.getElementById("root"));
