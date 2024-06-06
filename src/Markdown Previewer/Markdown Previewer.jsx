import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import $ from "jquery";

// for sanitizing html
import DOMPurify from "dompurify";
// for parsing Markdown
import { marked } from "marked";

// for hot loading css
import "../../Public/Markdown Previewer/Markdown Previewer.css"
// for resetting to the exercise menu
import Reset from "../Reset";

// store initial state
const storeInitial = {
  editorText: "Hello"
};

// payload example
const updateText = { type: 'editorText/edit', payload: null }

const exampleReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'editorText/edit':
      const markdown = DOMPurify.sanitize(marked.parse(action.payload));
      return {
        ...state,
        editorText: markdown,
      };
    default:
      return state;
  };
};

const store = createStore(exampleReducer);

class EditorHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getState();
  }

  render() {
    return (
      <div id="editor-header" className="header"></div>
    )
  }
};

class EditorTextArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getState();

    this.userInput = this.userInput.bind(this);
  }

  // sends what user types in editor to store
  userInput(event) {
    event.preventDefault()
    store.dispatch({ type: "editorText/edit", payload: event.target.value })
    this.setState(store.getState())
  }

  render() {
    return (
      <form action="#" >
        <textarea
          name="editor-textarea"
          id="editor"
          onKeyUp={this.userInput}>
        </textarea>
      </form>
    )
  }
};

class Editor extends React.Component {
  constructor(props) {
    super(props);

    // remember to bind this if you make any methods inside object
    // this.updateQuote = this.updateQuote.bind(this);
  }

  render() {
    return (
      <div id="editor-wrap" className="box-wrap">
        <EditorHeader />
        <EditorTextArea />
      </div>
    )
  }
};

class PreviewHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getState();
  }

  render() {
    return (
      <div id="preview-header" className="header"></div>
    )
  }
};

class PreviewTextArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getState();
  }

  updateText() {
  }

  render() {
    return (
      <div
        name="preview-textarea"
        id="preview"
      >
        {this.props.editorText}
      </div>
    )
  }
};

// this connects the textarea to the store,
// so that it can receive updates
const mapStateToProps = (state, _ownprops) => {
  return { editorText: state.editorText }
};
PreviewTextArea = connect(mapStateToProps)(PreviewTextArea);

class Preview extends React.Component {
  constructor(props) {
    super(props);

    // remember to bind this if you make any methods inside object
    // this.updateQuote = this.updateQuote.bind(this);
  }

  render() {
    return (
      <div id="preview-wrap" className="box-wrap">
        <PreviewHeader />
        <PreviewTextArea />
      </div>
    )
  }
};


ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <Editor></Editor>
    <Preview></Preview>
  </Provider>,
  $("#root")[0]
);
