import React, { Component } from "react";
import axios from 'axios';
import logo from '../../logo.svg';

class Verification extends Component {
    // This is the constructor that stores the data.
    constructor(props) {
        super(props);

        this.onChangeMessage = this.onChangeMessage.bind(this);

        this.state = {
            message: "Verifying email"
        };
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/verify/' + this.props.token)
        .then(response => {
            this.setState({message: JSON.stringify(response.data)})
        }).catch(({response}) => {
            this.setState({message: JSON.stringify(response.data)})
        })
    }

    // These methods will update the state properties.
    onChangeMessage(e) {
        this.setState({
            message: e.target.value,
        });
    }

    // This following section will display the form that takes the input from the user.
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Response from API: {this.state.message}
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}

export default Verification