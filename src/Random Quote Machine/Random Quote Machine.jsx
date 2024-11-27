import reactDom from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import store from "../store";

reactDom.render(
  <Provider store={store}>
    <h1>hello</h1>
  </Provider>,
  document.getElementById("root"));
