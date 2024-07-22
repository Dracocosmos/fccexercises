// no top level await in codepen!

import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/JavaScript Calculator/JavaScript Calculator.css"
// for resetting to the exercise menu
import Reset from "../Reset";

const storeInitial = {
  currentTotal: 0,
  currentFormula: [],
  currentFormulaString: "",
  acceptableButtons: {
    "0": { type: "number", id: "zero" },
    "1": { type: "number", id: "one" },
    "2": { type: "number", id: "two" },
    "3": { type: "number", id: "three" },
    "4": { type: "number", id: "four" },
    "5": { type: "number", id: "five" },
    "6": { type: "number", id: "six" },
    "7": { type: "number", id: "seven" },
    "8": { type: "number", id: "eight" },
    "9": { type: "number", id: "nine" },
    ".": { type: "decimal point", id: "decimal" },
    ",": { type: "alias", id: "comma", aliasFor: "." },
    "/": { type: "operator", id: "divide" },
    "*": { type: "operator", id: "multiply" },
    "-": { type: "operator", id: "subtract" },
    "+": { type: "operator", id: "add" },
    "=": { type: "enter", id: "equals" },
    "Enter": { type: "alias", id: "enter", aliasFor: "=" },
    "Backspace": { type: "backspace", id: "backspace" }
  },
};

class formulaBlock {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.validNumber = false;

    // if first char in value is .
    if (this.type === "decimal point") {
      this.type = "number";
      this.value = "0.";
    };
  }

  checkIfValidNumber() {
    // these are invalid numbers
    const invalid = ["", "-0.", "-."]
    const isInInvalid = (invValue) => {
      return this.value === invValue;
    };

    // if any are invalid, return false
    if (invalid.some(isInInvalid)) {
      return false
    } else {
      return true
    };
  }

  removeInvalid() {
    if (this.value.endsWith('.')) {
      this.value = this.value.slice(0, -1);
    };

    // if not valid
    if (!this.checkIfValidNumber()) {
      this.value = "";
      this.validNumber = false;
      return true;
    };
    return false;
  }

  backspaceValue() {
    this.value = this.value.slice(0, -1);
    this.validNumber = false;
  }

  updateValue(value) {
    switch (this.type) {
      case "operator":
        this.value = value;
        break;

      case "number":
        switch (value) {
          // if updating with decimal point
          case ".":
            // if you have just a - in value
            if (this.value === "-") {
              this.value = "-0."
            };
            if (!this.value.includes(".")) {
              this.value = this.value + value;
            };
            break;

          // if turning number negative
          case "-":
            if (this.value.length === 0) {
              this.value = value;
            };
            break;

          // if updating with 0
          case "0":
            // if first zero
            if (this.value !== "0"
              && this.value !== "-0") {
              this.value = this.value + value;
            };
            break;

          // if updating with backspace
          case "backspace":
            break;

          // if updating with number
          default:
            // if value is 0
            if (this.value === "0"
              || this.value === "-0") {
              this.value = value;
            } else {
              this.value = this.value + value;
            };
            break;
        };

        break;
      default:
        break;
    };

  }
};

const calculatorReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'currentFormula/update':
      // all possible buttons
      const buttons = state.acceptableButtons;
      // a button object for pressed button
      let pressedButton = buttons[action.payload];

      // if action is an alias
      if (pressedButton.type === "alias") {
        action.payload = pressedButton.aliasFor;
        pressedButton = buttons[pressedButton.aliasFor];
      };

      // sometimes decimal point needs to be a number
      const pressedButtonType = pressedButton.type === "decimal point"
        ? "number"
        : pressedButton.type;

      const formula = state.currentFormula;

      const returnHelper = () => {
        const formulaString = state.currentFormula.map((entry) => entry.value).join("");
        return {
          ...state,
          currentFormula: formula,
          currentFormulaString: formulaString
        };
      };

      // if first block, make new
      if (formula.length === 0) {
        const newBlock = new formulaBlock(pressedButton.type, action.payload)

        switch (action.payload) {
          // if first pressed is a backspace
          case 'Backspace':
            break;

          // if first pressed is a -
          case '-':
            newBlock.type = "number"
            formula.push(newBlock);
            break;

          default:
            // if first pressed is not an operator
            if (pressedButtonType !== "operator") {
              formula.push(newBlock);
            };
            break;
        }

        console.log(newBlock, "new block created")
        console.log(existingBlock, "1")
        console.log(...formula.map((block) => block.value))
        returnHelper();
        return {
          ...state,
          currentFormula: formula
        };
      };
      let existingBlock = formula[formula.length - 1];

      // remove entries
      if (pressedButtonType === 'backspace') {
        // remove a single letter
        existingBlock.backspaceValue();
        // remove block
        if (existingBlock.type === "backspace"
          || existingBlock.value === "") {
          formula.pop();
        };

        console.log(existingBlock, "2")
        console.log(...formula.map((block) => block.value))
        return {
          ...state,
          currentFormula: formula
        };

        // add entry if block types don't match
      } else if (existingBlock.type !== pressedButtonType) {
        // if negating a number
        if (existingBlock.value === "-"
          && existingBlock.type === "number"
        ) {
          console.log(existingBlock, "3")
          console.log(...formula.map((block) => block.value))
          return {
            ...state,
            currentFormula: formula
          };
        };

        // remove invalid previous block
        if (existingBlock.removeInvalid()) {
          formula.pop();
          formula.pop();
        };

        const newBlock = new formulaBlock(pressedButton.type, action.payload)
        formula.push(newBlock);
        existingBlock = formula[formula.length - 1];

        // add entry if block types match
      } else {
        // if negating a number
        if (existingBlock.type === "operator"
          && action.payload === "-") {
          const newBlock = new formulaBlock("number", action.payload)
          formula.push(newBlock);
          existingBlock = formula[formula.length - 1];
        } else {
          existingBlock.updateValue(action.payload)
        };
      };

      console.log(existingBlock, "4")
      console.log(...formula.map((block) => block.value))
      return {
        ...state,
        currentFormula: formula
      };

    case 'formula/calculate':
      const formulaString = state.currentFormula.map((entry) => entry.value).join("");
      const evaluatedString = eval(formulaString).toString();

      console.log(evaluatedString)
      return {
        ...state,
        currentFormula: [new formulaBlock("number", evaluatedString)],
        currentTotal: evaluatedString
      };
    default:
      return state;
  };
};

const store = createStore(calculatorReducer);

// logic for any button click
const userInput = (key) => {
  if (Object.keys(storeInitial.acceptableButtons)
    // gets the first class in classlist
    .includes(key)) {
    if (key === "Enter"
      || key === "=") {
      store.dispatch({
        type: "formula/calculate"
      })
    } else {
      store.dispatch({
        type: 'currentFormula/update',
        payload: key
      });
    };
  };
};

// single button
const Pad = (props) => {
  // on button press
  const handleButtonClick = (event) => {
    event.preventDefault();
    userInput(event.target.classList.item(0))
  };

  return (
    <button id={props.id}
      onClick={handleButtonClick}
      className={`${props.button} pad-button`}
    >
      {props.button}
    </button >
  )
};

const NumberPad = () => {
  // Send all of the acceptable keys to create individual buttons
  return (
    <div id="buttons-div">
      {Object.entries(store.getState().acceptableButtons)
        .map((buttonInfo, index) => {
          // only real buttons, not their aliases
          if (buttonInfo[1].type !== "alias") {
            return <Pad {...{
              button: buttonInfo[0],
              ...buttonInfo[1]
            }} key={index} />
          };
        })}
    </div>
  )
};

// TODO: does not show currentformula string or otherwise
const Display = (props) => {
  // const formulaString = props.formula.currentFormula.map(
  //   (block) => block.value).join("");

  console.log(props.formula.currentFormula, "in Display")
  return (
    <div>
      {[props.formula.currentFormula, props.formula.currentTotal]}
    </div>
  )
}

let Calculator = (props) => {
  // calculator button hits
  const handleKeyDown = (event) => {
    event.preventDefault();
    // console.log(event)
    userInput(event.key);
  };

  React.useEffect(() => {
    // componentdidmount here
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Display formula={props}></Display>
      <NumberPad></NumberPad>
    </div>
  );
};

const mapStateToProps = (state, _ownprops) => ({
  currentFormula: state.currentFormulaString,
  currentTotal: state.currentTotal
});
const mapDispatchToProps = {};
Calculator = connect(mapStateToProps, mapDispatchToProps)(Calculator);

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <Calculator></Calculator>
  </Provider>,
  $("#root")[0]
);
