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
    ".": { type: "decimal point", id: "dot" },
    ",": { type: "alias", id: "comma", aliasFor: "." },
    "/": { type: "operator", id: "division" },
    "*": { type: "operator", id: "multiplication" },
    "-": { type: "operator", id: "subtraction" },
    "+": { type: "operator", id: "addition" },
    "Enter": { type: "enter", id: "enter" },
    "Backspace": { type: "backspace", id: "backspace" }
  },
};

class formulaBlock {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.validNumber = false;

    if (this.type === "decimal point") {
      this.type = "number"
      this.value = "0."
    };
  }

  checkIfValidNumber() {
    const invalid = ["", "0", "-0"]

    const isValid = (invValue) => {
      return this.value === invValue;
    };

    if (invalid.some(isValid)) {
      this.validNumber = false;
    } else {
      this.validNumber = true;
    };
  }

  backspaceValue() {
    this.value = this.value.slice(0, -1);
    this.checkIfValidNumber();
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

          // if updating with number
          default:
            this.value = this.value + value;
            break;
        };

        this.checkIfValidNumber();
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
      let currentButton = buttons[action.payload];

      // if action is an alias
      if (currentButton.type === "alias") {
        action.payload = currentButton.aliasFor;
        currentButton = buttons[currentButton.aliasFor];
      };

      const currentBlock = new formulaBlock(currentButton.type, action.payload);

      console.log(currentBlock)

      // console.log(formula)
      return {
        ...state,
        // currentFormula: formula
      };
    case 'formula/calculate':
      //TODO: make string valid, even if it has operator at end, 00 at start etc
      const formulaString = state.currentFormula.join("");

      // format string for eval
      let firstEntry = state.acceptableButtons[formulaString[0]];
      let lastEntry = state.acceptableButtons[formulaString[-1]];
      return {
        ...state,
        currentTotal: eval(formulaString)
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
    if (key === "Enter") {
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
    <div id="">
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

const Calculator = (props) => {
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
      <NumberPad></NumberPad>
    </div>
  );
};

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = {};
connect(mapStateToProps, mapDispatchToProps)(Calculator);

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <Calculator></Calculator>
  </Provider>,
  $("#root")[0]
);
