import React from "react";
import exerciseStore from "./exerciseStore";

const Reset = () => {
  return (
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
  );
};

export default Reset
