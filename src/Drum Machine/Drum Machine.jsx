import ReactDOM from "react-dom";
import React from "react";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import $, { post } from "jquery";

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
      key: 'Q', name: '', reactKey: 1,
      url: ''
    },
    {
      key: 'W', name: '', reactKey: 2,
      url: ''
    },
    {
      key: 'E', name: '', reactKey: 3,
      url: ''
    },
    {
      key: 'A', name: '', reactKey: 4,
      url: ''
    },
    {
      key: 'S', name: '', reactKey: 5,
      url: ''
    },
    {
      key: 'D', name: '', reactKey: 6,
      url: ''
    },
    {
      key: 'Z', name: '', reactKey: 7,
      url: ''
    },
    {
      key: 'X', name: '', reactKey: 8,
      url: ''
    },
    {
      key: 'C', name: '', reactKey: 9,
      url: ''
    }
  ],
  lastPlayed: null,
};

// delete old database
try {
  indexedDB.deleteDatabase('SampleDatabase')
} catch (error) {
  console.log("old database not found, no action needed");
}

// needs to be a promise, so the site waits for the db creation
// there is no error handling, oops
const createDb = () => {
  return new Promise((resolve, reject) => {

    // open db, sends an event, upgradeneeded
    const request = window.indexedDB.open("SampleDatabase");

    request.onerror = (event) => {
      console.error("database request failed");
      console.error(event)
      reject(event)
    };

    request.onsuccess = (event) => {

      const sampledb = event.target.result;
      console.log("sample database created")

      resolve(sampledb)
    };

    // handle opening request
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log(`Upgrading to version ${db.version}`);

      // Create an objectStore for this database
      const objectStore = db.createObjectStore("SampleDatabase", {
        keyPath: "taskTitle",
      });

      // define what data items the objectStore will contain
      objectStore.createIndex("hours", "hours", { unique: false });
      objectStore.createIndex("minutes", "minutes", { unique: false });
      objectStore.createIndex("day", "day", { unique: false });
      objectStore.createIndex("month", "month", { unique: false });
      objectStore.createIndex("year", "year", { unique: false });
    };

    request.onblocked = (event) => {
      console.log('blocked ...', event);

      event.target.result.close();
    };

  });
};

const sampledb = await createDb()
console.log(sampledb)

sampledb.onerror = (event) => {
  // Generic error handler for all errors targeted at this database's
  // requests!
  console.error(`Database error: ${event.target.errorCode}`);
};

// sets all audio to local db
sampleSources.forEach((sample, _index) => {
  const sampleAudio = new Audio(sample.url);


});

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
