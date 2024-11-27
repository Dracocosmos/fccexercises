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
    "/": "operator",
    "*": "operator",
    "-": "operator",
    "+": "operator",
    "0": "number",
    "1": "number",
    "2": "number",
    "3": "number",
    "4": "number",
    "5": "number",
    "6": "number",
    "7": "number",
    "8": "number",
    "9": "number",
    ".": "operator",
    ",": "operator",
    "Enter": "operator",
  },
};
const calculatorReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'currentFormula/update':
      state.currentFormula[-1];
      const newFormula = state.currentFormula + action.payload
      const newTotal = newFormula
      console.log(newFormula)
      return {
        ...state,
        currentFormula: newFormula
      }
    case 'formula/calculate':
      return {
        ...state,
      };
    default:
      return state;
  };
};

const store = createStore(calculatorReducer);

const Number = (props) => {
  // the tests need the id to be written out...
  const numberTexts = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  return (
    <button id={numberTexts[props.number]}>
      {props.number}
    </button>
  )
}


const NumberPad = () => {
  // the ...Array etc. creates an array of numbers 0-9, which are
  // sent one by one to a Number component
  return (
    <div id="">
      {[...Array(10).keys()].map((pnumber) => {
        return <Number {...{ number: pnumber }} key={pnumber} />
      })}
    </div>
  )
}

const Calculator = (props) => {
  window.addEventListener("keydown", (event) => {
    if (Object.keys(storeInitial.acceptableButtons).includes(event.key)) {
      // console.log(event)
      store.dispatch({ type: 'currentFormula/update', payload: event.key });
    };
  });

  useEffect(() => {
    // componentdidmount here
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      window.removeEventListener("keydown")
    }
  }, [])

  return (
    <div>
      <NumberPad></NumberPad>
    </div>
  )
}

const mapStateToProps = (state) => ({ ...state })
const mapDispatchToProps = {}
connect(mapStateToProps, mapDispatchToProps)(Calculator)

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <Calculator></Calculator>
  </Provider>,
  $("#root")[0]
);
