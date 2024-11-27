import React from "react";
import store from "./store";

// TODO = Make a react object that has a list of all the excercises, with links that 
// refreshes the page to that exercise.

// move the exercises to store
const App = () => {
  const exercises = store.getState().exercises
  console.log(exercises)
  return (
    <h2>
      {exercises.map((text, id) => {
        return (<li className="menu_link" key={id}><a href={`${text}/${text}.jsx`}>{text}</a></li>)
      })}
    </h2>
  )
}

export default App
