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
  currentFormula: "",
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
    "Enter": { type: "operator", id: "enter" },
    "/": { type: "operator", id: "division" },
    "*": { type: "operator", id: "multiplication" },
    "-": { type: "operator", id: "subtraction" },
    "+": { type: "operator", id: "addition" },
  },
};

const calculatorReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'currentFormula/update':
      const buttons = state.acceptableButtons;
      const currentButton = buttons[action.payload];
      const currentFormula = state.currentFormula;
      const lastInput = currentFormula.slice(-1);
      const lastInputObject = buttons[lastInput];

      // if action is an alias
      if (currentButton.type === "alias") {
        action.payload = currentButton.aliasFor;
      };

      // if action is a repeat operator
      if (lastInput
        && lastInputObject.type === "operator"
        && currentButton.type === "operator"
      ) {
        action.payload = "";
      };

      const newFormula = state.currentFormula + action.payload;
      const newTotal = newFormula;

      console.log(newFormula)
      return {
        ...state,
        currentFormula: newFormula
      };
    case 'formula/calculate':
      return {
        ...state,
        currentTotal: String.eval
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
