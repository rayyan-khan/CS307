import React, { Component } from 'react'
import axios from 'axios'

class Verification extends Component {
    // This is the constructor that stores the data.
    constructor(props) {
        super(props)

        this.onChangeMessage = this.onChangeMessage.bind(this)

        this.state = {
            message: 'Verifying email...',
        }
    }

    componentDidMount() {
        axios
            .get('http://localhost:5000/api/verify/' + this.props.token)
            .then((response) => {
                this.setState({ message: JSON.stringify(response.data) })

                let token = response.data.token

                if (token) {
                    axios.defaults.headers.common['authorization'] = token
                    localStorage.setItem('token', token)
                    let url = window.location.href
                    window.location.href =
                        url.substring(0, url.indexOf('/')) + '/onboarding'
                }
            })
            .catch(({ response }) => {
                if (!response || !response.data) {
                    this.setState({ message: 'Some other error' })
                } else this.setState({ message: JSON.stringify(response.data) })
                if (this.state.message.replace(/["']/g, "") === "Account already verified") {
                    let url = window.location.href
                    window.location.href =
                        url.substring(0, url.indexOf('/')) + '/homepage'
                }
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
            <div className="App" style={{ backgroundColor: 'black' }}>
                <header className="App-header" style={{ transform: "translateY(-10vh)" }}>
                    <p style={{ color: 'mediumturquoise' }}>{this.state.message.replace(/["']/g, "")}</p>

                </header>
            </div>
        )
    }
}

export default Verification
