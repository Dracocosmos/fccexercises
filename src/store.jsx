import { createStore } from "redux";

const initialState = {
  exercises: [
    "Random Quote Machine",
    "test"
  ],
}

const exerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case '':
      return ''
    default:
      return state
  }
};

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
};

const store = createStore(exerciseReducer);

export default store
