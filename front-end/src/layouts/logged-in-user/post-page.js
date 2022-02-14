import React from 'react'

import logo from '../../logo.png';

class PostPage extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            This is the post page
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
export default PostPage;