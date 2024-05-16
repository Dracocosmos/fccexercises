import React from "react";
import reactDom from "react-dom";
import store from "./src/store";

import { Provider } from "react-redux";

import App from "./src/App";

reactDom.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById("root"));
