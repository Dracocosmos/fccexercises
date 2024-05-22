import { combineReducers, createStore } from "redux";

// get from local storage
const getActiveExercise = () => {
  // reset
  // setActiveExercise();
  const storageItem = JSON.parse(sessionStorage.getItem("activeExercise"))

  if (storageItem) {
    return storageItem.active
  };
  return null
}

// set to local storage, no exercise = reset
const setActiveExercise = (exercise = null) => {
  // what to save in localstorage
  const storageItem = {
    active: exercise,
    reset: null
  };

  sessionStorage.setItem("activeExercise", JSON.stringify(storageItem));

  return storageItem.active
};

// set initial state for store
const exerciseInitialState = {
  list: [
    "Random Quote Machine",
    "Markdown Previewer"
  ],
  // check localstorage if there is an active exercise
  active: getActiveExercise(),
}

// reducer for switching exercise
const exerciseReducer = (state, action) => {

  if (state == undefined) {
    state = exerciseInitialState
  };

  switch (action.type) {
    case 'exercises/activate':
      setActiveExercise(action.payload);
      return {
        ...state,
        active: getActiveExercise()
      };
    case 'exercises/reset':
      setActiveExercise()
      return {
        ...state,
        active: getActiveExercise()
      };
    default:
      return state;
  };
};

// if more reducers in the future
const rootReducer = combineReducers({
  exercises: exerciseReducer,
});

const exerciseStore = createStore(rootReducer);

export default exerciseStore
