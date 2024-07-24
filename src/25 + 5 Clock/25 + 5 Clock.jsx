// no top level await in codepen!

import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/25 + 5 Clock/25 + 5 Clock.css"
// for resetting to the exercise menu
import Reset from "../Reset";

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
    25 + 5 Clock
  </Provider>,
  $("#root")[0]
);
