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
  editorText: `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freecodecamp logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)`,
  editorHtml: "",
  // editor modes: 0: show markup,
  // 1: show raw
  editorMode: 0
};

// payload example
const updateText = { type: 'editorText/edit', payload: null }

const editorReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'editorText/edit':
      const html = DOMPurify.sanitize(marked.parse(action.payload));
      const purifiedText = DOMPurify.sanitize(action.payload);
      // const markdown = marked.parse(action.payload);
      return {
        ...state,
        editorText: purifiedText,
        editorHtml: html,
      };

    case 'editorMode/switch':
      let currentMode = state.editorMode;

      // scroll through modes
      currentMode = currentMode + 1;
      if (currentMode >= 2 || currentMode <= -1)
        currentMode = 0;

      return {
        ...state,
        editorMode: currentMode
      };

    default:
      return state;
  };
};

const store = createStore(editorReducer);

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
          onKeyUp={this.userInput}
          defaultValue={this.state.editorText}>
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

class ModeSwitchButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...store.getState(),
      // get initial button text
      buttonText: "Switch to Markup"
    }

    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick(event) {
    event.preventDefault()

    const switchMode = (newButtonText) => {
      // update store
      store.dispatch({ type: 'editorMode/switch', payload: null });

      // update local state
      this.setState({
        ...store.getState(),
        buttonText: newButtonText
      })
    };

    switch (this.state.editorMode) {
      case 0:
        switchMode("Switch to interpreted text")
        return;
      case 1:
        switchMode("Switch to Markup")
        return;
      default:
        break;
    }
  }

  render() {
    console.log()
    return (
      <button onClick={this.buttonClick}>
        {this.state.buttonText}
      </button>
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
      <div id="preview-header" className="header">
        <ModeSwitchButton></ModeSwitchButton>
      </div>
    )
  }
};

class PreviewTextArea extends React.Component {
  constructor(props) {
    super(props);

    // this makes it so that initial text is ran through the markdown intrepreter
    store.dispatch({ type: "editorText/edit", payload: this.props.editorText })

    this.chooseText = this.chooseText.bind(this)
  }

  chooseText(_text) {
    switch (this.props.editorMode) {
      case 0:
        return this.props.editorHtml
      case 1:
        return this.props.editorHtml
      default:
        return "error"
    }
  }

  render() {
    // this uses the editor text prop so it keeps calling the method
    const divText = this.chooseText(this.props.editorText)
    console.log($.parseHTML(divText))
    console.log($.parseHTML(divText).map((element, _id) => element))
    return (
      <div
        name="preview-textarea"
        id="preview"
      >
        {$.parseHTML(divText).map((element, _id) => element)}
      </div>
    )
  }
};

// this connects the textarea to the store,
// so that it can receive updates
const mapStateToProps = (state, _ownprops) => {
  return { ...state }
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
