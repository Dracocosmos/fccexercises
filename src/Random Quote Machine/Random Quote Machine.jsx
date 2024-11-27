import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider } from "react-redux";

import $ from "jquery";

// for getting logos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter as tweetIcon } from '@fortawesome/free-brands-svg-icons'

// for hot loading css
import "../../Public/Random Quote Machine/Random Quote Machine.css"
// for resetting to the exercise menu
import Reset from "../Reset";

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

// import { faCamera } from '@fortawesome/fontawesome-svg-core'
const FaIcon = () => <FontAwesomeIcon icon={tweetIcon} className="fa-icon" />

// tweet button element
class TweetButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getState();

    this.tweetQuoteHTML = this.tweetQuoteHTML.bind(this);
    this.updateState = this.updateState.bind(this);
    this.linkHref = this.linkHref.bind(this);
  }

  // get a html link with correct quote
  tweetQuoteHTML() {
    return `https://twitter.com/intent/tweet?text=${this.state.currentQuote[1]}`
  }

  updateState() {
    this.setState(() => {
      return {
        ...store.getState()
      };
    });
  }

  linkHref() {
    this.updateState();
    $("#tweet-quote").attr("href", this.tweetQuoteHTML());
  }

  render() {
    return (
      <div id="tweet_wrap" className="button-style">
        <a
          // whenever you middle click:
          onAuxClick={this.linkHref}
          // whenever you click
          onClick={this.linkHref}
          href={this.tweetQuoteHTML()}
          id="tweet-quote">
          <FaIcon></FaIcon>
        </a>
      </div>
    )
  }
};

// box element
class QuoteBox extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch({ type: "quote/get" });

    this.state = store.getState();

    //remember to bind this if you make any methods inside object
    this.updateQuote = this.updateQuote.bind(this);
  }

  // new-quote button logic
  updateQuote() {
    store.dispatch({ type: "quote/get" });
    this.setState({
      ...store.getState()
    });
  }

  render() {
    return (
      <div id="quote-box">
        <h2 id="text">
          "{this.state.currentQuote[1]}"
        </h2>
        <div id="author">
          <span>{this.state.currentQuote[0]}</span>
        </div>
        <button
          type="button"
          id="new-quote"
          onClick={this.updateQuote}
          className="button-style">
          New Quote
        </button>
        <TweetButton></TweetButton>
      </div>
    )
  };
};

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <QuoteBox />
  </Provider>,
  // jquery returns a jquery object. 
  // First thing in it is the native DOM element
  $("#root")[0])
