import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";

// TODO = Make a react object that has a list of all the excercises, with links that 
// refreshes the page to that exercise.

const exercises = [
  "Random Quote Machine",
  "test"
]

const App = () => {
  return (
    <h2>
      {exercises.map((text, id) => {
        return (<li key={id}><a href={text}>{text}</a></li>)
      })}
    </h2>
  )
}

export default App
