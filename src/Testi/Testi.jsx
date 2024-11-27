import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/Testi/Testi.css"
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
    Testi
  </Provider>,
  $("#root")[0]
);
