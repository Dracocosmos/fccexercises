import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import $, { post } from "jquery";

// for hot loading css
import "../../Public/Drum Machine/Drum Machine.css"
// for resetting to the exercise menu
import Reset from "../Reset";

const storeInitial = {
  samples: [
    {
      key: 'Q', name: 'Heater 1', reactKey: 1,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3'
    },
    {
      key: 'W', name: 'Heater 2', reactKey: 2,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3'
    },
    {
      key: 'E', name: 'Heater 3', reactKey: 3,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3'
    },
    {
      key: 'A', name: 'Heater 4', reactKey: 4,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3'
    },
    {
      key: 'S', name: 'Clap', reactKey: 5,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3'
    },
    {
      key: 'D', name: 'Open HH', reactKey: 6,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3'
    },
    {
      key: 'Z', name: 'Kick-n\'-hat', reactKey: 7,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3'
    },
    {
      key: 'X', name: 'Kick', reactKey: 8,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3'
    },
    {
      key: 'C', name: 'Closed-HH', reactKey: 9,
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3'
    }
  ],
  lastPlayed: null,
};


const audioReducer = (state = storeInitial, action) => {
  switch (action.type) {
    case 'lastPlayed/update':
      return {
        ...state,
        lastPlayed: action.payload
      };
    default:
      return state;
  };
};

const store = createStore(audioReducer);

// all the drum buttons,
class DrumButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = store.getState();

    // remember to bind this if you make any methods inside object
    this.playSound = this.playSound.bind(this);
    this.keyDown = this.keyDown.bind(this);

  }

  keyDown(event) {
    this.state.samples.forEach((sample) => {
      if (event.key.toLowerCase() == sample.key.toLowerCase()) {
        this.playSound(event, sample)
      };
    });
  };

  playSound(event, sample) {
    event.preventDefault();

    let audio = $(`#${sample.key}`)[0];
    audio.play();

    store.dispatch({ type: "lastPlayed/update", payload: sample })
  }

  // TODO: something is too slow with playing keys, maybe have to cancel prev audio to play next

  componentDidMount() {
    document.addEventListener("keydown", this.keyDown);
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDown);
  }

  render() {
    return (
      // <> = react fragment, jsx requires a parent element.
      <>
        {this.state.samples.map((sample, _index) => {
          return (
            <div
              className="button-wrapper"
              key={`${sample.reactKey}-fragment`}
            >
              <button
                id={`${sample.name}-button`}
                key={`${sample.reactKey}-button`}
                // when clicked, send the sample object to playsound
                onClick={(event) => this.playSound(event, sample)}
                className="drum-pad"
                type="button"
              >
                <audio
                  src={sample.url}
                  id={sample.key}
                  className="clip"
                  key={`${sample.reactKey}-audio`}
                >
                </audio>
                {sample.key}
              </button>
              <div
                id={`${sample.name}-div`}
                key={`${sample.reactKey}-div`}
                className="under-button"
              >
                {sample.name}
              </div>
            </div>
          );
        })}
      </>
    )
  }
};

class DrumDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lastPlayed = this.props.lastPlayed
    return (
      <div
        id="display"
        key="display-div"
      >
        {lastPlayed ? lastPlayed.name : ""}
      </div>
    )
  }
};

// this connects the area to the store,
// so that it can receive updates
const mapStateToProps = (state, _ownprops) => {
  return { lastPlayed: state.lastPlayed }
};
DrumDisplay = connect(mapStateToProps)(DrumDisplay);

// wrapper div for buttons
class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="drum-machine">
        <DrumButtons></DrumButtons>
        <DrumDisplay></DrumDisplay>
      </div>
    )
  }
};

ReactDOM.render(
  <Provider store={store}>
    <Reset></Reset>
    <DrumMachine></DrumMachine>
  </Provider>,
  $("#root")[0]
);
