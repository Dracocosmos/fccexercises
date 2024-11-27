import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import $, { post, type } from "jquery";

// for hot loading css
import "../../Public/Drum Machine/Drum Machine.css"
// for resetting to the exercise menu
import Reset from "../Reset";

const sampleSources = [
  {
    name: 'Heater 1',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3'
  },
  {
    name: 'Heater 2',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3'
  },
  {
    name: 'Heater 3',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3'
  },
  {
    name: 'Heater 4',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3'
  },
  {
    name: 'Clap',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3'
  },
  {
    name: 'Open HH',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3'
  },
  {
    name: 'Kick-n\'-hat',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3'
  },
  {
    name: 'Kick',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3'
  },
  {
    name: 'Closed-HH',
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3'
  }
];

const storeInitial = {
  samples: [
    {
      key: 'Q', name: '',
    },
    {
      key: 'W', name: '',
    },
    {
      key: 'E', name: '',
    },
    {
      key: 'A', name: '',
    },
    {
      key: 'S', name: '',
    },
    {
      key: 'D', name: '',
    },
    {
      key: 'Z', name: '',
    },
    {
      key: 'X', name: '',
    },
    {
      key: 'C', name: '',
    }
  ],
  lastPlayed: null,
};
// individual keys for react
storeInitial.samples.forEach((sample, index) => sample.reactKey = index)

// save initial samples
const saveSamples = async (sampleList) => {
  // can't use forEach loop with await
  for (let index = 0; index < sampleList.length; index++) {
    const source = sampleSources[index]
    const sample = sampleList[index]

    const audio = await fetch(source.url);
    sample.audio = await audio.blob();
    sample.url = URL.createObjectURL(sample.audio);

    sample.name = source.name
  };
};

await saveSamples(storeInitial.samples);
console.log(storeInitial.samples[0])

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

    this.state = {
      ...store.getState(),
      keyPressed: false,
      deleteLoop: true,
    };

    // remember to bind this if you make any methods inside object
    this.playSound = this.playSound.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.deleteAudio = this.deleteAudio.bind(this);

  }

  keyDown(event) {
    this.state.samples.forEach((sample) => {
      if (event.key.toLowerCase() == sample.key.toLowerCase()) {
        this.playSound(event, sample)
      };
    });
  };

  async deleteAudio() {

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    let i = 0;
    while (this.state.deleteLoop) {
      // console.log("loop alive")
      // for actually doing the removing of old audio
      const removeAll = () => {
        const remove = document.querySelectorAll(".remove");
        if (remove.length > 0) {
          console.log("removed:", remove, "i:", i)
          remove.forEach((node, _i) => {
            node.remove();
          })
        };
      };

      // set delay
      await sleep(4000);

      // delete if key hasn't been pressed during delay
      if (!this.state.keyPressed) {
        removeAll()
      };

      // key has not been pressed
      this.setState({ keyPressed: false })
    };
  }

  async playSound(event, sample) {
    // TODO: use Web Audio API
    event.preventDefault();

    // the tests wont pass if you don't play audio from the 
    // exact element, but it will not play new audio quickly enough from 
    // the same button if you don't create a new audio element.
    try {
      const audio = $(`#${sample.key}`)[0]
      // const audioClone = audio.cloneNode(false)

      try {
        audio.c
        // audio.muted = true;
        await audio.play();

        // await audioClone.play();
      } catch (err) {
        console.error("error playing audio", err)
      }

      // const audioParent = audio.parentNode
      // audioParent.appendChild(audioClone);

      // for delete audio, needs to know button has been pressed
      this.setState({ keyPressed: true })

      // audio.classList.add("remove")

      store.dispatch({ type: "lastPlayed/update", payload: sample })

    } catch (err) {
      console.error("error processing audio", err)
    }

  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyDown);

    // start cleanup loop
    this.deleteAudio()
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDown);

    // stop cleanup loop
    this.setState({ deleteLoop: false });
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
                onClick={async (event) => this.playSound(event, sample)}
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
