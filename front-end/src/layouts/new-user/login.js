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
      loginError: 'No account with this username/password combination.',
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

  loginUser=()=>{ 
    
    console.log("Passed to axios");
      const payload = {
        username: this.state.user.Username,
        password: this.state.user.Password
      }
    axios.post("http://localhost:5000/api/login", payload)
      .then((response) => {
        console.log("got a response");
        console.log(response.data);
        this.setState({ axiosError: false });
      })
      .catch(({ response }) => {
        console.log("got an error");
        console.log(response.data);
        this.setState({ loginError: response.data.errors[0] });
        console.log(this.state.loginError);
        this.setState({ axiosError: true });
      })

      if(this.state.axiosError === false) {
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/idkwhereitgoes"; // figure out where this goes
        console.log("Figure out where this should go to.")
      }

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
        <Popover>
          <PopoverTrigger>
            <Button colorScheme='black' onClick={this.loginUser} fontSize={25}
              bg='mediumturquoise' style={{ transform: "translateY(2vh)" }} >Submit</Button>
            </PopoverTrigger>
            <PopoverContent bg='black' fontWeight='bold' fontSize={16}>
              <PopoverArrow />
              <PopoverCloseButton />
              {!this.state.axiosError ? (<PopoverHeader>Logging in...</PopoverHeader>)
                : (<PopoverHeader> {this.state.loginError} </PopoverHeader>)}
            </PopoverContent>
        </Popover>

        </header>
      </div>
    );
  }
}
export default Login;