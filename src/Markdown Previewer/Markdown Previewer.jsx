import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/Markdown Previewer/Markdown Previewer.css"
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

class Editor extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch({ type: "quote/get" });

    this.state = store.getState();

    //remember to bind this if you make any methods inside object
    this.updateQuote = this.updateQuote.bind(this);
  }

  // new-quote button logic
  updateQuote() {
  }

  render() {
  }
};

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <Editor />
  </Provider>,
  $("#root")[0]
);
