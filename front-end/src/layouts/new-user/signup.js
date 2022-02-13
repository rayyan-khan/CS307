import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input
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
        Email:'',
        Username:'',
        Password:'',
        PasswordCheck:''
      }
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
  }
  else {
      // invalid email, show error
      console.log("Invalid Email");
  }

  // check that username meets requirements
  // requirements: only contains A-Za-z, 0-9, _ or .
  // max length 20 characters
  let checkUser = /(?=^.{0,20}$)^[A-Za-z0-9_.]*$/;
  if(checkUser.test(this.state.user.Username)) {
    // meets requirements
    console.log("Username meets requirements");
  }
  else {
    let checkUserChar = /^[A-Za-z0-9_.]*$/;
    if(checkUserChar.test(this.state.user.Username) == false) {
      console.log("Username may only contain letters, numbers, underscore or period.");
    }
    let checkUserLen = /.{0, 20}$/;
    if(checkUserLen.test(this.state.user.Username) == false) {
      console.log("Username is too long. Max 20 characters.");
    }
    
    // have error pop up

  }

  // check if passwords match
  if(this.state.user.Password===this.state.user.PasswordCheck) {
    console.log("Passwords Match");
  }
  else {
    // have pop up show passwords do not match
    console.log("Passwords do not match")
  }


  console.log(this.state.user);
}

  render() {   
    return (
      <div className="App">
        <header className="App-header">

          <h2>Signup</h2>
          <p></p>
          <form>
          
          <label>Email: <input type="text" name="Email" 
                          value={this.state.user.Email} onChange={this.changeHandler} 
                          style={{ color: 'black'}}></input></label>
          <p> </p>
          <label>Username: <input type="text" name="Username"
                          value={this.state.user.Username} onChange={this.changeHandler}
                          style={{ color: 'black'}}></input></label>
          <p> </p>
          <label>Password: <input type="text" name="Password"
                          value={this.state.user.Password} onChange={this.changeHandler}
                          style={{ color: 'black'}}></input></label>
          <p> </p>
          <label>Password Check: <input type="text" name="PasswordCheck"
                          value={this.state.user.PasswordCheck} onChange={this.changeHandler}
                          style={{ color: 'black'}}></input></label>
        </form>
        <button onClick={this.registerUser}>Submit</button>
        </header>
      </div>

    );
  }
}
export default Login;