import React from 'react'
import { connect } from "react-redux";

import logo from '../logo.png';

function Homepage() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    This is the home page for {localStorage.getItem("username") !== null ? localStorage.getItem("username") : "a new user"}
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

export default Homepage;