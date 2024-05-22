import reactDom from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import exerciseStore from "../exerciseStore";
import Reset from "../Reset";
import $ from "jquery";
import { createStore } from "redux";

// TODO: create store for quotes

// initial store state
// TODO: maybe get them from somewhere?
const storeInitial = {
  quotes: [
    "Not Here",
    "Not There"
  ]
};

//quote randomizer
const randomQuote = () => {

};


// get quotes 
const quoteReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'quote/get':
      return {
        ...state,
      };
    default:
      return state;
  };
};

const store = createStore(quoteReducer);

// box element
class QuoteBox extends React.Component {
  render() {
    return <h2>Hi, I am a Car!</h2>;
  };
};

reactDom.render(
  <Provider store={exerciseStore}>
    <Reset></Reset>
    <Provider store={store}>
      <QuoteBox />
    </Provider>
  </Provider>,
  document.getElementById("root"));
