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
  PopoverAnchor
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import logo from '../../logo.png';
import "bootstrap/dist/css/bootstrap.min.css";
import { useAnimationFrame } from 'framer-motion';

// Need to translate up a bit (line that junaid put then deleted)
// need to figure out how to display specific message about why registration failed

const axios = require('axios');

class Login extends React.Component {
  emailError = false;
  
  constructor(props) {
    super();
    this.state = {
      user:{
        Email:'',
        Username:'',
        Password:'',
        PasswordCheck:'',
      },
      emailError: false,
      userError: false,
      passwordError: false,
      passwordCheckError: false,
      axiosError: true,
      registrationError: ''
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
  // check that email is a real email format (___@___.___)
  // check that username meets whatever the requirements
  // check that passwords match & meet requirements
  console.log("Pressed submit");

  // check if email is valid format
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if ( re.test(this.state.user.Email) ) {
      // this is a valid email address
      console.log("Valid Email");
      this.setState({emailError: false})
  }
  else {
      // invalid email, show error
      console.log("Invalid Email");
      this.setState({emailError: true})
  }

  // check that username meets requirements
  // requirements: only contains A-Za-z, 0-9, _ or .
  // max length 20 characters
  let checkUser = /(?=^.{1,20}$)^[A-Za-z0-9_.]*$/;
  if(checkUser.test(this.state.user.Username)) {
    // meets requirements
    console.log("Username meets requirements");
    this.setState({userError: false})
  }
  else {
    // set username error to true
    this.setState({userError: true})

    // log reason(s) why its erroring to the console
    let checkUserChar = /^[A-Za-z0-9_.]*$/;
    if(!checkUserChar.test(this.state.user.Username)) {
      console.log("Username may only contain letters, numbers, underscore or period.");
    }
    let checkUserLen = /.{0, 20}$/;
    if(!checkUserLen.test(this.state.user.Username)) {
      console.log("Username is too long. Max 20 characters.");
    }
  }

  // check if password is valid (at least 8 characters 1 letter and 1 number)
  let checkPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if(checkPassword.test(this.state.user.Password)) {
    console.log("Password meets requirements");
    this.setState({passwordError: false})
  }
  else {
    console.log("Password does not meet requirements");
    this.setState({passwordError: true})
  }

  // check if passwords match
  if(this.state.user.Password===this.state.user.PasswordCheck) {
    console.log("Passwords Match");
    this.setState({passwordCheckError: false})
  }
  else {
    // have pop up show passwords do not match
    console.log("Passwords do not match");
    this.setState({passwordCheckError: true});
  }

  console.log(this.state.user);

  // AXIOS STUFF
  // pass to axios if there are no errors
  
  console.log(this.state.axiosError);
  if(this.state.emailError === false && 
    this.state.userError === false && 
    this.state.passwordError === false && 
    this.state.passwordCheckError === false) {
    console.log("Passed to axios");
    const payload = {
      email: this.state.user.Email,
      username: this.state.user.Username,
      password: this.state.user.Password
    }
    axios.post("http://localhost:5000/api/register", payload)
      .then((response) => {
        console.log("got a response");
        console.log(response.data);
        this.setState({axiosError: false});
      })
      .catch(({response}) => {
        console.log("got an error");
        console.log(response.data);
        this.setState({registrationError: response.data});
        this.setState({axiosError: true});
      })
  }
  
}

  render() {   
    return (
      // translate up?? 
      <div className="App">
        <header  className="App-header">  
          <h2>Signup</h2>
          <p></p>
          <form>

          {/* email entry part of form */}
          <FormControl isInvalid={this.state.emailError}>
            <FormLabel htmlFor='email'> </FormLabel>
            <Input 
              focusBorderColor='teal.200'
              errorBorderColor='red.300'
              placeholder = 'Email address' 
              type = "text" 
              name="Email" 
              value={this.state.user.Email} 
              onChange={this.changeHandler}/>
              {!this.state.emailError ? ( <FormHelperText> Enter a valid email. </FormHelperText>) 
              : (<FormErrorMessage>The email you entered is invalid.</FormErrorMessage>)}
          </FormControl>

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
            onChange={this.changeHandler}/>
          {!this.state.userError ? ( <FormHelperText> Username must be less then 20 characters and consist of letters, numbers, underscore and period. </FormHelperText>) 
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
            onChange={this.changeHandler}/>
          {!this.state.passwordError ? ( <FormHelperText> Make a good password if you don't want to get hacked. </FormHelperText>) 
           : (<FormErrorMessage>Enter a valid password (must be at least 8 characters and have at least 1 letter and 1 number).</FormErrorMessage>)}
          </FormControl>

          {/* passwordCheck entry part of form */}
          <FormControl isInvalid={this.state.passwordCheckError}>
          <FormLabel htmlFor='passwordCheck'> </FormLabel>
          <Input 
            focusBorderColor='teal.200'
            errorBorderColor='red.300'
            placeholder = 'Retype your password' 
            type = "text" 
            name="PasswordCheck" 
            value={this.state.user.PasswordCheck} 
            onChange={this.changeHandler}/>
          {!this.state.passwordCheckError ? ( <FormHelperText>Make sure this password matches the one above. </FormHelperText>) 
           : (<FormErrorMessage>Your password doesn't match the one above.</FormErrorMessage>)}
          </FormControl>

        </form>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme='black' onClick={this.registerUser} fontSize={25}>Submit</Button>
          </PopoverTrigger>
          <PopoverContent bg='black' fontWeight='bold' fontSize={18}>
            <PopoverArrow />
            <PopoverCloseButton />
            {!this.state.axiosError ? (<PopoverHeader>Success! You are registered.</PopoverHeader>) 
             : (<PopoverHeader> There were problems with your registration :(</PopoverHeader>)}
          </PopoverContent>
        </Popover>
        </header>
      </div>

    );
  }
}
export default Login;