import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  PopoverAnchor,
  transform
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
      loginError: 'There were problems with your login.'
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
            focusBorderColor='teal.200'
            errorBorderColor='red.300'
            placeholder = 'Password' 
            type = "text" 
            name="Password" 
            value={this.state.user.Password} 
            onChange={this.changeHandler}
            style={{color:'darkturquoise'}}/>
          {!this.state.passwordError ? ( <FormHelperText> </FormHelperText>) 
           : (<FormErrorMessage>Your password was incorrect</FormErrorMessage>)}
          </FormControl>

        </form>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme='black' onClick={this.loginUser} fontSize={25} 
            bg='mediumturquoise' style = {{transform: "translateY(2vh)"}} >Login</Button>
          </PopoverTrigger>
          <PopoverContent bg='black' fontWeight='bold' fontSize={18}>
            <PopoverArrow />
            <PopoverCloseButton />
            {!this.state.axiosError ? (<PopoverHeader>Success! You are logged in.</PopoverHeader>) 
             : (<PopoverHeader> There were problems with your login. </PopoverHeader>)}
          </PopoverContent>
        </Popover>

        </header>
      </div>
    );
  }
}
export default Login;