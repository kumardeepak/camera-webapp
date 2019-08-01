import React, { Component } from 'react';
// import { Route, Router } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
import './App.css';

// import Home from './views/Home';
// import ImageInput from './views/ImageInput';
import VideoInput from './views/VideoInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <VideoInput />
      </div>
    );
  }
}

export default App;
