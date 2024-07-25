// no top level await in codepen!

import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import $ from "jquery";

// for hot loading css
import "../../Public/25 + 5 Clock/25 + 5 Clock.css"
// for resetting to the exercise menu
import Reset from "../Reset";

const storeInitial = {
  breakTime: 5,
  breakTime: 1,
  sessionTime: 25,
  sessionTime: 1,
  active: false,
  // currentTimeMs: new Date().getTime(),
  currentTimeMs: 0,
};

const clockReducer = (state = storeInitial, action) => {

  // for setting break and session times
  function validNumber(number, maxVal = 60) {
    return (number <= maxVal)
      && (number >= 0)
  };
  function newNumber(oldNumber, direction) {
    let newNumber = direction === "inc"
      ? oldNumber + 1
      : oldNumber - 1

    newNumber = validNumber(newNumber)
      ? newNumber
      : oldNumber

    return newNumber
  };

  switch (action.type) {
    case 'breaktime/update':
      return {
        ...state,
        breakTime: newNumber(state.breakTime, action.payload)
      };
    case 'sessiontime/update':
      return {
        ...state,
        sessionTime: newNumber(state.sessionTime, action.payload)
      };
    case 'clockstate/update':
      return {
        ...state,
        active: !state.active
      };
    default:
      return state;
  };
};

const store = createStore(clockReducer);


let SelectorButtons = (props) => {

  const handleclick = (event) => {
    event.preventDefault()
    props.dispatch({
      type: `${props.for}time/update`,
      payload: event.target.attributes.dir.value
    })
  };

  return (
    <div className="selectorbuttons-wrapper">
      <button
        id={`${props.for}-inc`}
        dir="inc"
        className="selector-button"
        onClick={handleclick}
      >∧</button>
      <button
        id={`${props.for}-dec`}
        dir="dec"
        className="selector-button"
        onClick={handleclick}
      >∨</button>
    </div>
  )
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     dispatch
//   };
// }
const mapButtonsStateToProps = (state) => ({ breakTime: state.breakTime })
SelectorButtons = connect(mapButtonsStateToProps)(SelectorButtons)

let BreakSelector = (props) => {
  return (
    <div id="breakselector-container">
      <div id="break-label">
        Break Length
      </div>
      <div id="break-length">
        {props.breakTime}
      </div>
      <SelectorButtons for="break"></SelectorButtons>
    </div>
  )
}

const mapBreakStateToProps = (state) => ({ breakTime: state.breakTime })
BreakSelector = connect(mapBreakStateToProps)(BreakSelector)

let SessionSelector = (props) => {
  return (
    <div id="sessionselector-container">
      <div id="session-label">
        Session Length
      </div>
      <div id="session-length">
        {props.sessionTime}
      </div>
      <SelectorButtons for="session"></SelectorButtons>
    </div>
  )
}

const mapSessionStateToProps = (state) => ({ sessionTime: state.sessionTime })
SessionSelector = connect(mapSessionStateToProps)(SessionSelector)

const ClockAudio = () => {
  // 1sec or longer audio
  // stop on reset hit
  return (
    <audio src="">
    </audio>
  )
}

let ClockDisplay = (props) => {
  // mm:ss 25:00
  return (
    <div id="time-left">
      {props.active.toString()}
    </div>
  )
}

let ClockControls = (props) => {

  // startTimeMs: 0,
  // onPauseTimeLeftMs: 0,
  // blockStartMs: 0,
  // blockEndMs: 0,

  const handleStartStop = (event) => {
    props.dispatch({ type: 'clockstate/update' })
  }

  const handleReset = (event) => {
  }

  return (
    <div>
      <button
        id="start_stop"
        onClick={handleStartStop}
      >
        Start
      </button>
      <button
        id="reset"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  )
}

let Clock = (props) => {
  return (
    <div>
      <div id="timer-label">
        Session
      </div>
      <ClockDisplay active={props.active}></ClockDisplay>
      <ClockControls dispatch={props.dispatch} ></ClockControls>
      <ClockAudio></ClockAudio>
    </div>
  )
}
const mapClockStateToProps = (state) => ({ active: state.active })
Clock = connect(mapClockStateToProps)(Clock)

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <BreakSelector></BreakSelector>
    <SessionSelector></SessionSelector>
    <Clock></Clock>
  </Provider>,
  $("#root")[0]
);
