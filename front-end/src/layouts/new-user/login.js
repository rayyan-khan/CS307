import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import logo from '../../logo.png';
import "bootstrap/dist/css/bootstrap.min.css";
import { useAnimationFrame } from 'framer-motion';

const axios = require('axios');

class Login extends React.Component {
  
  constructor(props) {
    super();
    this.state = {
      user:{
        Username:'',
        Password:'',
      },
      userError: false,
      passwordError: false,
      axiosError: true,
      loginError: 'There were problems with your login.',
      show: false
    }
  }

  changeHandler=e=>{
    const name = e.target.name;
    const value = e.target.value;
    //console.log(value);
  
    this.setState({user:{
      ...this.state.user,
      [name]:value
    }});
  }

  registerUser=()=>{ 
    console.log("Pressed login");
  }

  handleClick=()=>{
    console.log("Show clicked");
    this.setState({show:!this.state.show});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" style = {{transform: "translateY(-8vh)"}}>
          
        <h2 style={{color:'mediumturquoise'}}>Login</h2>
          <p></p>
          <form>

          {/* username entry part of form */}
          <FormControl isInvalid={this.state.userError}>
          <FormLabel htmlFor='username'> </FormLabel>
          <Input 
            focusBorderColor='teal.200'
            errorBorderColor='red.300'
            placeholder = 'Username' 
            type = "text" 
            name="Username" 
            value={this.state.user.Username} 
            onChange={this.changeHandler}
            style={{color:'darkturquoise'}}/>
          {!this.state.userError ? ( <FormHelperText>  </FormHelperText>) 
           : (<FormErrorMessage>The username you entered is invalid.</FormErrorMessage>)}
          </FormControl>

          {/* password entry part of form */}
          <FormControl isInvalid={this.state.passwordError}>
          <FormLabel htmlFor='password'> </FormLabel>
          <Input
            pr='4.5rem'
            type={this.state.show ? 'text' : 'password'}
            placeholder='Enter password' 
            style={{color:'darkturquoise'}} 
          />
          <InputRightElement width='4.5rem'>
            <Button colorScheme='black'  bg='darkturquoise' h='1.75rem' size='sm' onClick={this.handleClick}
            style = {{transform: "translateY(1vh)"}}>
              {this.state.show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
          {!this.state.passwordError ? ( <FormHelperText> </FormHelperText>) 
           : (<FormErrorMessage>Your password was incorrect</FormErrorMessage>)}
          </FormControl>

        </form>
      

        </header>
      </div>
    );
  }
}
export default Login;