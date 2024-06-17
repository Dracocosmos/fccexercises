import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider } from "react-redux";

import $, { post } from "jquery";

// for hot loading css
import "../../Public/Drum Machine/Drum Machine.css"
// for resetting to the exercise menu
import Reset from "../Reset";

const storeInitial = {
  samples: [
    {
      key: 'Q', name: 'Heater 1',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3'
    },
    {
      key: 'W', name: 'Heater 2',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3'
    },
    {
      key: 'E', name: 'Heater 3',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3'
    },
    {
      key: 'A', name: 'Heater 4',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3'
    },
    {
      key: 'S', name: 'Clap',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3'
    },
    {
      key: 'D', name: 'Open HH',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3'
    },
    {
      key: 'Z', name: 'Kick-n\'-hat',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3'
    },
    {
      key: 'X', name: 'Kick',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3'
    },
    {
      key: 'C', name: 'Closed-HH',
      url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3'
    }
  ],
  lastPlayed: null
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
  }

  playSound(event, sample) {
    event.preventDefault();

    let audio = new Audio(sample.url);
    audio.play();

    store.dispatch({ type: "lastPlayed/update", payload: sample })
  }

  componentDidMount() {
    const parent = document.getElementById("drum-machine");

    if (parent) {
      parent.childNodes.forEach((element, index) => {
        element.insertAdjacentElement('afterend', (<p>hello</p>))
      });
    };
  }

  render() {
    return (
      // <> = react fragment, jsx requires a parent element.
      <>
        {this.state.samples.map((sample, index) => {
          return (
            <button
              id={`${sample.name}-button`}
              key={index}
              // when clicked, send the sample object to playsound
              onClick={(event) => this.playSound(event, sample)}
              className="drum-pad"
              type="button"
            >
              <audio
                src={sample.url}
                id={sample.key}
                className="clip"
              >
              </audio>
              {sample.key}
            </button>
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
    return (
      <div
        id="display"
      >
      </div>
    )
  }
};

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
