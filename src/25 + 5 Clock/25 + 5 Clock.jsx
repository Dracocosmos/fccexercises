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
    this.loopActive = false

    // in ms until otherways said
    this.breakTime = breakTime * 60 * 1000
    this.sessionTime = sessionTime * 60 * 1000
    this.sessionTimeMinutes = sessionTime
    this.breakTimeMinutes = breakTime

    // gives out ms values, first for session, then break, to infinity
    this.nextBlockGenerator = this._timeGenerator(this.breakTime, this.sessionTime)
    this.currentBlockTimeLeft = this.nextBlockGenerator.next().value

    // how much time left in the currently running block
    // either pause or break
    this.timeLeftSeconds = this.currentBlockTimeLeft / 60

    // starting value for display
    this._updateDisplayString(this.sessionTimeMinutes)

    console.log(this.displayString, 0)
  }

  // yields times given, first sessionT, then breakT
  * _timeGenerator(breakT, sessionT) {
    let lastValue = null
    while (true) {
      if (lastValue === sessionT) {
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

    // if timer has run out
    if (currentTimeLeftSeconds < 0) {
      // get new value from generator, to add to end time, +1000 so I can end
      // the previous count in 00:00 (makes it so that every block is a second too long)
      this.currentBlockTimeLeft = this.nextBlockGenerator.next().value + 1000
      // and displaying the new left over time
      this.currentBlockEndTime = this.currentBlockEndTime + this.currentBlockTimeLeft

      // could be a dispatch, but no energy
      const audio = document.getElementById('block-end-audio')
      audio.play()

      // if there has been a change in seconds, not milliseconds, update
    } else if (this.timeLeftSeconds - currentTimeLeftSeconds != 0) {
      // save for next comparison
      this.timeLeftSeconds = currentTimeLeftSeconds

      // for updating display, first make numbers
      const displayTimeMinutes = Math.floor(currentTimeLeftSeconds / 60)
      const displayTimeSeconds = currentTimeLeftSeconds - displayTimeMinutes * 60

      // then update
      this._updateDisplayString(displayTimeMinutes, displayTimeSeconds)

      console.log(this.displayString, 1)
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

const storeInitial = {
  breakTime: 5,
  sessionTime: 25,
  active: false,
  currentClockDisplay: "hi",
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
        && (number >= 0)
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
        id={`${props.for}-inccrement`}
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
    <audio
      src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      id="block-end-audio"
    >
    </audio>
  )
}

const ClockDisplay = (props) => {
  // mm:ss 25:00
  return (
    <div id="time-left">
      {props.currentClockDisplay}
    </div>
  )
}

// create a clock instance
let timer = new clock(store.getState().breakTime, store.getState().sessionTime)

let firstClick = true
const ClockControls = (props) => {


  const handleStartStop = (event) => {
    event.preventDefault()
    console.log("startstop")

    // if first time starting, needs to get a new clock with session
    // and break lenghts from store
    if (firstClick) {
      if (props.sessionTime === timer.sessionTimeMinutes
        && props.breakTime === timer.breakTimeMinutes) {
        timer.startPause()
      } else {
        console.log(storeInitial.breakTime)
        timer.reset()
        timer = new clock(props.breakTime, props.sessionTime)
        timer.startPause()
      }
    } else {
      timer.startPause()
    }
  }

  const handleReset = (event) => {
    event.preventDefault()

    const audio = document.getElementById('block-end-audio')
    audio.pause()

    console.log("reset")
    // could just always create new timer, i guess
    if (props.sessionTime === timer.sessionTimeMinutes
      && props.breakTime === timer.breakTimeMinutes) {
      timer.reset()
    } else {
      console.log(storeInitial.breakTime)
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
  }

  return (
    <div>
      <button
        id="start_stop"
        onClick={handleStartStop}
      >
        {props.active
          ? "Stop"
          : "Start"}
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
        {props.currentBlockDisplay}
      </div>
      <ClockDisplay
        active={props.active}
        currentClockDisplay={props.currentClockDisplay}
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
