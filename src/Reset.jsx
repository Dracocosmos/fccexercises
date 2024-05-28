import React from "react";
import exerciseStore from "./exerciseStore";
import { Provider } from "react-redux";

const Reset = () => {
  return (
    <Provider store={exerciseStore}>
      <a
        id="exercises_reset"
        onClick={() => {
          exerciseStore.dispatch({
            type: "exercises/reset", payload: null
          })
        }}
        href="../index.html"
        style={{
          position: "absolute",
          top: "20px",
          right: "25px",
        }}
      >
        reset
      </a>
    </Provider>
  );
};

export default Reset
