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
  // breakTime: 0.05,
  sessionTime: 25,
  // sessionTime: 0.05,
  active: false,
  currentClockDisplay: "00:00",
  currentBlockDisplay: "session",
};

const clockReducer = (state = storeInitial, action) => {

  // for setting break and session times
  function newNumber(oldNumber, payload) {
    // if payload number, return it as is
    if (typeof payload === "number") {
      return payload
    }

    function validNumber(number, maxVal = 60) {
      return (number <= maxVal)
        && (number > 0)
    };

    let newNumber = payload === "+"
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
        active: action.payload
      };
    case 'timerDisplay/update':
      return {
        ...state,
        currentClockDisplay: action.payload
      };
    case 'blockDisplay/update':
      return {
        ...state,
        currentBlockDisplay: action.payload
      };
    default:
      return state;
  };
};

const store = createStore(clockReducer);

class clock {
  constructor(breakTime, sessionTime, startFrom = null) {
    this._clockSetup(breakTime, sessionTime, startFrom)
  }

  // for both reset and constructor
  _clockSetup(breakTime, sessionTime, startFrom = null) {
    this.loopActive = false

    // in ms until otherways said
    this.breakTime = breakTime * 60 * 1000
    this.sessionTime = sessionTime * 60 * 1000
    this.sessionTimeMinutes = sessionTime
    this.breakTimeMinutes = breakTime

    // gives out ms values, first for session, then break, to infinity
    this.nextBlockGenerator = this._timeGenerator(this.breakTime, this.sessionTime, startFrom)
    this.currentBlockTimeLeft = this.nextBlockGenerator.next().value

    // how much time left in the currently running block
    // either pause or break
    this.timeLeftSeconds = this.currentBlockTimeLeft / 60

    // starting value for display
    // check which block underway
    let displayM = this.currentBlockName === "Session"
      ? this.sessionTimeMinutes
      : this.breakTimeMinutes
    // check if time is under one minute
    const displayS = displayM < 1
      ? displayM * 60
      : 0
    // reset minutes if seconds exist
    displayS === 0
      ? null
      : displayM = 0

    // update display
    this._updateDisplayString(displayM, displayS)

  }

  // yields times given, first sessionT, then breakT
  * _timeGenerator(breakT, sessionT, startFrom = null) {
    // if you define a starting point, can be 
    // "Break" or "Session", else starts from 
    // "Session"

    // sets lastValue to opposite what you want,
    // so that later it switches back in the 
    // while loop
    this.currentBlockName = startFrom === "Break"
      ? "Session"
      : "Break"
    let lastValue = null

    while (true) {
      if (this.currentBlockName === "Session") {
        lastValue = breakT
        this.currentBlockName = "Break"
      } else {
        lastValue = sessionT
        this.currentBlockName = "Session"
      }
      store.dispatch({ type: "blockDisplay/update", payload: this.currentBlockName })

      yield lastValue
    }
  }

  // send to store the activity state
  set loopActive(boolean) {
    this.loopActiveValue = boolean
    store.dispatch({ type: "clockstate/update", payload: boolean })
  }
  get loopActive() {
    return this.loopActiveValue
  }

  // for updating this.displayString
  _updateDisplayString(minutes = 0, seconds = 0) {
    // make strings of the numbers
    const addZeroReturnString = (number) => {
      let string = number.toString()
      return string.length > 1
        ? string
        : "0" + string
    }
    // update value
    this.displayString = addZeroReturnString(minutes)
      + ":"
      + addZeroReturnString(seconds)

    store.dispatch({ type: "timerDisplay/update", payload: this.displayString })
  }

  // for local timer loop, called in loop
  async _updateTimes() {
    // get new time in ms
    const currentTime = Date.now()

    // new time left in ms
    this.currentBlockTimeLeft = this.currentBlockEndTime - currentTime
    // this.currentBlockTimeLeft = this.currentBlockTimeLeft < 0
    // ? 0
    // : this.currentBlockTimeLeft

    // time in seconds for if you want to update, didn't want to compare strings
    // also for making new string
    const currentTimeLeftSeconds = Math.ceil(this.currentBlockTimeLeft / 1000)

    // play audio when 0 reached
    if (currentTimeLeftSeconds == 0) {
      // could be a dispatch, but no energy
      const audio = document.getElementById('beep')
      audio.volume = 0.2;
      audio.play()
    }

    // if timer has run out
    if (currentTimeLeftSeconds < 0) {
      // get new value from generator, to add to end time, +1000 so I can end
      // the previous count in 00:00 (makes it so that every block is a second too long)
      this.currentBlockTimeLeft = this.nextBlockGenerator.next().value + 1000
      // and displaying the new left over time
      this.currentBlockEndTime = this.currentBlockEndTime + this.currentBlockTimeLeft

      // if there has been a change in seconds, not milliseconds, update
    } else if (this.timeLeftSeconds - currentTimeLeftSeconds != 0) {
      // save for next comparison
      this.timeLeftSeconds = currentTimeLeftSeconds

      // for updating display, first make numbers
      const displayTimeMinutes = Math.floor(currentTimeLeftSeconds / 60)
      const displayTimeSeconds = currentTimeLeftSeconds - displayTimeMinutes * 60

      // then update
      this._updateDisplayString(displayTimeMinutes, displayTimeSeconds)

    }

  }

  // this runs the checking timing for timer
  async _loop() {
    // this.loopActive = true

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (
      this.loopActive === true
    ) {
      await sleep(10)
      // there is a race condition with reset if sleep is above like that
      // might be fixed if sleep after updating, but don't care
      if (this.loopActive === true) {
        // async function so loop does not lag
        this._updateTimes()
      }
    }
  }

  // these are for controlling the clock from the outside
  startPause() {
    this.loopActive = !this.loopActive
    if (!this.loopActive) {
      // this.loopActive = false
    } else {
      // this is for comparing against in the loop
      this.startTime = Date.now()
      // this is the calculated endtime for timer. Adds to itself every time
      // started again so timer doesn't reset itself
      this.currentBlockEndTime = this.currentBlockTimeLeft + this.startTime
      this._loop()
    }
  }

  reset() {
    this._clockSetup(this.breakTimeMinutes, this.sessionTimeMinutes)
  }
}
// create a clock instance
let timer = new clock(store.getState().breakTime, store.getState().sessionTime)

let firstClick = true

let SelectorButtons = (props) => {

  const handleclick = (event) => {
    event.preventDefault()
    // only move if clock is not running
    if (!timer.loopActive) {
      props.dispatch({
        type: `${props.for}time/update`,
        payload: event.target.attributes.dir.value
      })
      timer = new clock(store.getState().breakTime, store.getState().sessionTime, timer.currentBlockName)
      props.dispatch({
        type: "timerDisplay/update",
        payload: timer.displayString
      })
    }
  };

  return (
    <div className="selectorbuttons-wrapper">
      <button
        id={`${props.for}-increment`}
        dir="+"
        className="selector-button"
        onClick={handleclick}
      >∧</button>
      <button
        id={`${props.for}-decrement`}
        dir="-"
        className="selector-button"
        onClick={handleclick}
      >∨</button>
    </div>
  )
}

let BreakSelector = (props) => {
  return (
    <div
      id="breakselector-container"
      className="selector-container"
    >
      <div
        id="break-label"
        className="selector-label"
      >
        Break Length
      </div>
      <div
        id="break-length"
        className="selector-value"
      >
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
    <div
      id="sessionselector-container"
      className="selector-container"
    >
      <div
        id="session-label"
        className="selector-label"
      >
        Session Length
      </div>
      <div
        id="session-length"
        className="selector-value"
      >
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
    <audio
      src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      id="beep"
    >
    </audio>
  )
}

const ClockDisplay = (props) => {
  // mm:ss 25:00
  return (
    <div
      id="clock-display-wrapper"
      className="selector-container"
    >
      <div
        id="timer-label"
        className="selector-label"
      >
        {props.currentBlockDisplay}
      </div>
      <div id="time-left"
        className="selector-value"
      >
        {props.currentClockDisplay}
      </div>
    </div>
  )
}

const ClockControls = (props) => {
  const handleStartStop = (event) => {
    event.preventDefault()

    // if first time starting, needs to get a new clock with session
    // and break lenghts from store
    if (firstClick) {
      if (props.sessionTime === timer.sessionTimeMinutes
        && props.breakTime === timer.breakTimeMinutes) {
        timer.startPause()
      } else {
        timer = new clock(props.breakTime, props.sessionTime, timer.currentBlockName)
        timer.startPause()
      }
    } else {
      timer.startPause()
    }
  }

  const handleReset = (event) => {
    event.preventDefault()

    const audio = document.getElementById('beep')
    audio.pause()
    audio.currentTime = 0

    timer.reset()
    timer = new clock(storeInitial.breakTime, storeInitial.sessionTime)
    props.dispatch({
      type: `breaktime/update`,
      payload: storeInitial.breakTime
    })
    props.dispatch({
      type: `sessiontime/update`,
      payload: storeInitial.sessionTime
    })
  }

  return (
    <div>
      <button
        id="start_stop"
        onClick={handleStartStop}
        className="control-button"
      >
        {props.active
          ? "Stop"
          : "Start"}
      </button>
      <button
        id="reset"
        onClick={handleReset}
        className="control-button"
      >
        Reset
      </button>
    </div>
  )
}

let ReactClock = (props) => {
  return (
    <div
      id="clock-wrapper"
    >
      <BreakSelector></BreakSelector>
      <SessionSelector></SessionSelector>
      <ClockDisplay
        active={props.active}
        currentClockDisplay={props.currentClockDisplay}
        currentBlockDisplay={props.currentBlockDisplay}
      ></ClockDisplay>
      <ClockControls
        dispatch={props.dispatch}
        sessionTime={props.sessionTime}
        breakTime={props.breakTime}
        active={props.active}
      ></ClockControls>
      <ClockAudio></ClockAudio>
    </div>
  )
}
const mapClockStateToProps = (state) => ({
  active: state.active,
  currentClockDisplay: state.currentClockDisplay,
  currentBlockDisplay: state.currentBlockDisplay,
  sessionTime: state.sessionTime,
  breakTime: state.breakTime
})
ReactClock = connect(mapClockStateToProps)(ReactClock)

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <ReactClock></ReactClock>
  </Provider>,
  $("#root")[0]
);
