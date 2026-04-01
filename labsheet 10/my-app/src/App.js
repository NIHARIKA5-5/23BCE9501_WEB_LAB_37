import React from "react";
import FormValidation from "./FormValidation";
import ItemList from "./ItemList";
import FetchData from "./FetchData";

function App() {
  return (
    <div>
      <h1>React Exercises</h1>

      <FormValidation />
      <hr />

      <ItemList />
      <hr />

      <FetchData />
    </div>
  );
}

export default App;