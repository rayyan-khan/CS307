import React from 'react'
import { connect } from "react-redux";

import logo from '../logo.png';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            searchQuery: "",
        };
    }
    UNSAFE_componentWillMount() {
        // What the user wants to search
        this.state.searchQuery = sessionStorage.getItem("search_query");

        // What the user is logged in as
        this.state.username = sessionStorage.getItem("username") !== null ? sessionStorage.getItem("username") : "a new user";
        console.log(this.state.searchQuery);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        This is the search result page for {this.state.username}
                        {" "} and they want to lookup {this.state.searchQuery}
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

export default SearchResult;