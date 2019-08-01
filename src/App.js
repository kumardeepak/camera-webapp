import React, { Component } from 'react';
import './App.css';

import VideoInput from './views/VideoInput';
import { TextDecoder,TextEncoder } from 'text-encoding';

if (!window['TextDecoder']) {
  window['TextDecoder'] = TextDecoder;
}
if (!window['TextEncoder']) {
  window['TextEncoder'] = TextEncoder;
}

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
