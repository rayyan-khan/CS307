import { Text } from '@chakra-ui/react';
import React from 'react'

import logo from '../logo.png';

class ScreenTooSmall extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Text color={'white'}>
            Your screen is only {window.innerWidth} pixels wide. To smoothly run our application, we require atleast 575 pixels. Please try making it biggeror try a different device
          </Text>
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