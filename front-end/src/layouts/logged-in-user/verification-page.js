import React, { Component } from 'react'
import axios from 'axios'

class Verification extends Component {
    // This is the constructor that stores the data.
    constructor(props) {
        super(props)

        this.onChangeMessage = this.onChangeMessage.bind(this)

        this.state = {
            message: 'Verifying email',
        }
    }

    componentDidMount() {
        axios
            .get('https://still-sierra-32456.herokuapp.com/api/verify/' + this.props.token)
            .then((response) => {
                this.setState({ message: JSON.stringify(response.data) })

                let token = response.data.token

                if (token) {
                    axios.defaults.headers.common['authorization'] = token

                    let url = window.location.href
                    window.location.href =
                        url.substring(0, url.indexOf('/')) + '/onboarding'
                }
            })
            .catch(({ response }) => {
                if (!response || !response.data) {
                    this.setState({ message: 'Some other error' })
                } else this.setState({ message: JSON.stringify(response.data) })
            })
    }

    // These methods will update the state properties.
    onChangeMessage(e) {
        this.setState({
            message: e.target.value,
        })
    }

    // This following section will display the form that takes the input from the user.
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Response from API: {this.state.message}</p>
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
        )
    }
}

export default Verification
