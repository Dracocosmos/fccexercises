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

class clock {
  constructor(breakTime, sessionTime) {
    this.breakTime = breakTime * 60 * 1000
    this.sessionTime = sessionTime * 60 * 1000
    // how much time left in the currently running session
    // either pause or break
    this.currentTimeLeft = this.sessionTime
    this.loopCount = 0
    this.displayTime = Math.floor(this.currentTimeLeft / 1000)
    console.log(this.displayTime)
    // currentTimeMs: new Date().getTime(),
    // startTimeMs: 0,
    // onPauseTimeLeftMs: 0,
    // blockStartMs: 0,
    // blockEndMs: 0,
  }

  async loop() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (
      this.currentTimeLeft > 10
      && this.loopCount < 10000
    ) {
      await sleep(10)
      const currentTime = Date.now()
      this.currentTimeLeft = (this.startTime + this.sessionTime) - currentTime
      this.displayTime = Math.floor(this.currentTimeLeft / 1000)
      this.loopCount += 1
      // TODO: figure out if firing an event is a good idea
    }
  }

  start() {
    this.startTime = Date.now()
    this.loop()
  }

  pause() {
  }

  reset() {
  }
}

const storeInitial = {
  breakTime: 5,
  breakTime: 1,
  sessionTime: 25,
  sessionTime: 1,
  active: false,
  currentTimer: null,
  clock: null,
};
// use values from initial store to init a clock
storeInitial.clock = new clock(
  storeInitial.breakTime,
  storeInitial.sessionTime,
);

const clockReducer = (state = storeInitial, action) => {

  // for setting break and session times
  function newNumber(oldNumber, direction) {
    function validNumber(number, maxVal = 60) {
      return (number <= maxVal)
        && (number >= 0)
    };

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
      state.active
        ? state.clock.pause()
        : state.clock.start()
      return {
        ...state,
        active: !state.active
      };
    case 'clock/reset':
      return {
        ...state,
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

let BreakSelector = (props) => {
  return (
    <div id="breakselector-container">
      <div id="break-label">
        Break Length
      </div>
      <div id="break-length">
        {props.breakTime}
      </div>
      <SelectorButtons
        for="break"
        dispatch={props.dispatch}
      >
      </SelectorButtons>
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
      <SelectorButtons
        for="session"
        dispatch={props.dispatch}
      >
      </SelectorButtons>
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

const ClockDisplay = (props) => {
  // mm:ss 25:00
  return (
    <div id="time-left">
      {props.active.toString()}
    </div>
  )
}


const ClockControls = (props) => {

  const handleStartStop = (event) => {
    event.preventDefault()
    props.dispatch({ type: 'clockstate/update' })
  }

  const handleReset = (event) => {
    event.preventDefault()
    props.dispatch({ type: 'clock/reset' })
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

let ReactClock = (props) => {
  return (
    <div>
      <BreakSelector></BreakSelector>
      <SessionSelector></SessionSelector>
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
ReactClock = connect(mapClockStateToProps)(ReactClock)

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <ReactClock></ReactClock>
  </Provider>,
  $("#root")[0]
);
