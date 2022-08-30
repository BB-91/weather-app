// import logo from './logo.svg';
import { useRef, useState } from 'react';
import './App.css';

// import { LOCAL_API } from "./data/localAPI.js"
// import LOCAL_API from "./data/localAPI.js"
import LOCAL_API from "./data/localAPI.mjs"
// import LocalAPI from "./data/localAPI.mjs"

const customApiURL = LOCAL_API.getURL();
// const customApiURL = LocalAPI.getURL();

function App() {

  return (
    <div className="App">
        Welcome to my App!
        customApiURL: {customApiURL}
    </div>
  );
}

export default App;
