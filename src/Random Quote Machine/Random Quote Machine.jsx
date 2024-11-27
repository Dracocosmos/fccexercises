import reactDom from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import Reset from "../Reset";

reactDom.render(
  <Provider store={store}>
    <h1>Random Quote Machine</h1>
    <Reset></Reset>
  </Provider>,
  document.getElementById("root"));
