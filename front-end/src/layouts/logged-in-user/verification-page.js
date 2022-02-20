import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    InputRightElement,
    Popover, 
    PopoverTrigger,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverContent
  } from '@chakra-ui/react'
import React, { Component } from 'react'
import axios from 'axios'
import { color } from '@chakra-ui/react'

class Verification extends Component {
    // This is the constructor that stores the data.
    constructor(props) {
        super(props)

        this.onChangeMessage = this.onChangeMessage.bind(this)

        this.state = {
            message: 'Verifying email',
            verify: '',
            verificationError: false
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
        console.log(this.state.message);
    }

    // This following section will display the form that takes the input from the user.
    render() {
        return (
            <div className="App" style={{backgroundColor: 'black'}}>
                <header className="App-header"  style = {{transform: "translateY(-10vh)"}}>
                    <p>Response from API: {this.state.message}</p>
                    
                    <h2 style={{color:'mediumturquoise'}}>Verification Page</h2>
                    <p></p>
                    <form>

                    {/* username entry part of form */}
                    <FormControl isInvalid={this.state.verificationError}>
                    <FormLabel htmlFor='verification'> </FormLabel>
                    <Input 
                        focusBorderColor='teal.200'
                        errorBorderColor='red.300'
                        placeholder = 'Verification' 
                        type = "text" 
                        name="Verification" 
                        value={this.state.verification} 
                        onChange={this.changeHandler}
                        style={{color:'darkturquoise'}}/>
                    {!this.state.userError ? ( <FormHelperText>  </FormHelperText>) 
                    : (<FormErrorMessage>The verification code you entered is invalid.</FormErrorMessage>)}
                    </FormControl>

                    </form>

                </header>
            </div>
        )
    }
}

export default Verification
