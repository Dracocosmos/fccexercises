import reactDom from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import exerciseStore from "../exerciseStore";
import Reset from "../Reset";
import $ from "jquery";
import { createStore } from "redux";

// for hot loading css
import "../../Public/Random Quote Machine/Random Quote Machine.css"

// TODO: create store for quotes

// initial store state
// TODO: maybe get them from somewhere?
const storeInitial = {
  quotes: [
    ["me", "Not Here"],
    ["that person", "But There"],
    ["gnome", "Have at it"],
    ["tree", "It's not all here"],
    ["Cat", "But neither there"]
  ],
  currentQuote: ""
};

//quote randomizer
const randomQuote = (array = ["no array provided"]) => {
  const randomNumber = Math.floor(Math.random() * array.length);

  return array[randomNumber]
};

// reducer for quotes 
const quoteReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'quote/get':
      const newQuote = randomQuote(state.quotes);
      return {
        ...state,
        currentQuote: newQuote
      };
    default:
      return state;
  };
};

const store = createStore(quoteReducer);

// box element
class QuoteBox extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch({ type: "quote/get" });

    this.state = store.getState();

    //remember to bind this if you make any methods inside object
    this.updateQuote = this.updateQuote.bind(this)
  }

  updateQuote() {
    store.dispatch({ type: "quote/get" });
    this.setState({
      ...store.getState()
    });
  }

  render() {
    return (
      <div id="quote-box">
        <h2 id="text">{this.state.currentQuote[1]}</h2>
        <div id="author">
          <span>{this.state.currentQuote[0]}</span>
        </div>
        <button
          type="button"
          id="new-quote"
          onClick={this.updateQuote}>
          Hello
        </button>
        <div id="tweet_wrap"><a href="" id="tweet-quote"></a></div>
      </div>
    )
  };
};

reactDom.render(
  <Provider store={exerciseStore}>
    <Reset></Reset>
    <Provider store={store}>
      <QuoteBox />
    </Provider>
  </Provider>,
  // jquery returns a jquery object. 
  // First thing in it is the native DOM element
  $("#root")[0])
