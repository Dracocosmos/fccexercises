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
    this._clockSetup(breakTime, sessionTime)
  }

  // for both reset and constructor
  _clockSetup(breakTime, sessionTime) {
    this.breakTime = breakTime * 60 * 1000
    this.sessionTime = sessionTime * 60 * 1000
    this.sessionTimeMinutes = sessionTime
    this.breakTimeMinutes = breakTime

    this.nextBlockGenerator = this._timeGenerator(this.breakTime, this.sessionTime)
    this.currentBlockTime = this.nextBlockGenerator.next().value

    this.loopActive = false

    // how much time left in the currently running block
    // either pause or break
    this.timeLeftSeconds = this.currentBlockTime / 60

    const tempS = this.sessionTimeMinutes.toString()
    this.displayString = tempS.length > 1
      ? tempS + ":00"
      : "0" + tempS + ":00"

    console.log(this.displayString)
  }

  // yields times given, first sessionT, then breakT
  * _timeGenerator(breakT, sessionT) {
    let lastValue = null
    while (true) {
      lastValue = lastValue === sessionT
        ? breakT
        : sessionT
      yield lastValue
    }
  }

  async _updateTimes() {
    // get new time in ms
    const currentTime = Date.now()

    // new time left in ms
    this.currentBlockTime = this.currentBlockEndTime - currentTime
    this.currentBlockTime = this.currentBlockTime < 0
      ? 0
      : this.currentBlockTime

    // time in seconds for if you want to update, didn't want to compare strings
    // also for making new string
    const currentTimeLeftSeconds = Math.floor(this.currentBlockTime / 1000)

    // if there has been a change in seconds, not milliseconds, update
    if (this.timeLeftSeconds - currentTimeLeftSeconds != 0) {
      // save for next comparison
      this.timeLeftSeconds = currentTimeLeftSeconds

      // for updating display, first make numbers
      const displayTimeMinutes = Math.floor(currentTimeLeftSeconds / 60)
      const displayTimeSeconds = currentTimeLeftSeconds - displayTimeMinutes * 60
      // then make string of those numbers
      const addZeroReturnString = (number) => {
        let string = number.toString()
        return string.length > 1
          ? string
          : "0" + string
      }
      this.displayString = addZeroReturnString(displayTimeMinutes)
        + ":"
        + addZeroReturnString(displayTimeSeconds)

      console.log(this.displayString)
    }

  }

  async _loop() {
    this.loopActive = true

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (
      this.loopActive === true
    ) {
      await sleep(10)
      // async function so loop does not lag
      this._updateTimes()

      // if timer has run out
      if (this.currentBlockTime < 9) {
        this.currentBlockTime = this.nextBlockGenerator.next().value
        this.currentBlockEndTime = this.currentBlockEndTime + this.currentBlockTime
      }
    }
  }

  start() {
    this.startTime = Date.now()
    this.currentBlockEndTime = this.currentBlockTime + this.startTime
    this._loop()
  }

  pause() {
    this.loopActive = false
  }

  reset() {
    this._clockSetup(this.breakTimeMinutes, this.sessionTimeMinutes)
  }
}

const storeInitial = {
  breakTime: 5,
  breakTime: 0.2,
  sessionTime: 25,
  sessionTime: 0.1,
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
      state.clock.reset()
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
