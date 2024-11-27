import React from "react";
import store from "./store";

// TODO: Make a react object that has a list of all the excercises, with links that 
// refreshes the page to that exercise.

// create action to switch active exercise
const switchActive = { type: 'exercises/activate', payload: null }

const App = () => {
  // get info from store
  const exercises = store.getState().exercises

  console.log(exercises.active);

  // load the active exercise
  if (exercises.active) {
    import(`./${exercises.active}/${exercises.active}.jsx`);
    return
  };

  // return a list of all the exercises for rendering
  return (
    <h2 id="main_menu">
      {exercises.list.map((text, id) => {
        // dispatch action to set page to exercise
        return (<li className="menu_link" key={id}>
          <a href={`${text}/${text}.html`} onClick={() => {
            store.dispatch(
              { type: 'exercises/activate', payload: text })
          }}>
            {text}
          </a>
        </li>)
      })}
    </h2>
  );
};

export default App
