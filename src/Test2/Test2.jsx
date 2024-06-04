import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/Test2/Test2.css"
// for resetting to the exercise menu
import Reset from "../Reset";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

document.getElementById("root")
sleep(20000);
console.log("hi")
const storeInitial = {
};

const exampleReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'default/get':
      return {
        ...state,
      };
    default:
      return state;
  };
};

const store = createStore(exampleReducer);

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    Test2
  </Provider>,
  $("root")[0]);
