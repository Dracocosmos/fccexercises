import React from "react";
// TODO = Make a react object that has a list of all the excercises, with links that 
// refreshes the page to that exercise.

const exercises = [
  "random_quote_machine",
]

const App = () =>{
  return (
    <h1>
      { exercises.forEach() }
      Welcome to a React App that has been built using Webpack and Babel separately
    </h1>
  )
}

export default App
