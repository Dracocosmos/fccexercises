import React from "react";
import reactDom from "react-dom";
import exerciseStore from "./src/exerciseStore";

import { Provider } from "react-redux";

import App from "./src/App";

reactDom.render(
  <Provider store={ exerciseStore }>
    <App />
  </Provider>,
  document.getElementById("root"));
