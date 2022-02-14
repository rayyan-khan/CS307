import React from 'react'

import logo from '../logo.png';

class ScreenTooSmall extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Your screen is too small to smoothly run our application. Please try making it bigger.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#C5B1F5" }}
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
export default ScreenTooSmall;