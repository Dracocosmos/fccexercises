import { combineReducers, createStore } from "redux";

const exerciseInitialState = {
  list: [
    "Random Quote Machine",
  ],
  active: null,
}

const exerciseReducer = (state, action) => {

  if (state == undefined) {
    state = exerciseInitialState
  };

  switch (action.type) {
    case 'exercises/activate':
      return {
        ...state,
        active: action.payload
      };
    default:
      return state;
  };
};

const rootReducer = combineReducers({
  exercises: exerciseReducer,
});

const store = createStore(rootReducer);

export default store
