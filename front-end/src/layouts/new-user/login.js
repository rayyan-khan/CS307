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
  PopoverContent,
  Box,
  Center,
  Text,
  InputGroup
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import logo from '../../logo.png';
import "bootstrap/dist/css/bootstrap.min.css";
import { useAnimationFrame } from 'framer-motion';
import '../layouts.css';

const axios = require('axios');

class Login extends React.Component {

  constructor(props) {
    super();
    this.state = {
      user: {
        Username: '',
        Password: '',
      },
      userError: false,
      passwordError: false,
      axiosError: true,
      loginError: 'No account with this username/password combination.',
      show: false
    }
  }

  changeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    //console.log(value);

    this.setState({
      user: {
        ...this.state.user,
        [name]: value
      }
    });
  }

  loginUser = () => {

    console.log("Passed to axios");
    const payload = {
      username: this.state.user.Username,
      password: this.state.user.Password
    }
    axios.post("http://localhost:5000/api/login", payload)
      .then((response) => {
        console.log("got a response");
        console.log(response.data);
        var token = response.data.token
        // TODO: Change the token in the local storage
        localStorage.setItem("token", token);
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
        this.setState({ axiosError: false });
      })
      .catch(({ response }) => {
        console.log("got an error");
        console.log(response.data);
        this.setState({ loginError: response.data.errors[0] });
        console.log(this.state.loginError);
        this.setState({ axiosError: true });
      })

    if (this.state.axiosError === false) {
      let url = window.location.href;
      window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
    }

  }

  handleClick = () => {
    console.log("Show clicked");
    this.setState({ show: !this.state.show });
  }

  forgotPassword = () => {
    let url = window.location.href;
    window.location.href = url.substring(0, url.indexOf("/")) + "/reset-password";
  }

  render() {
    return (
      <div className="color-switch">
        <Center>
          <Box paddingTop={'35vh'} width={'20vw'} height={'90vh'}>
            <Center>
              <Text fontSize={'4xl'} style={{ color: 'mediumturquoise' }}>Login</Text>
            </Center>
            <p></p>
            <form>

              {/* username entry part of form */}
              <FormControl isInvalid={this.state.userError}>
                <FormLabel htmlFor='username'> </FormLabel>
                <Input
                  focusBorderColor='teal.200'
                  errorBorderColor='red.300'
                  placeholder='Username'
                  type="text"
                  name="Username"
                  value={this.state.user.Username}
                  onChange={this.changeHandler}
                  style={{ color: 'darkturquoise' }} />
                {!this.state.userError ? (<FormHelperText>  </FormHelperText>)
                  : (<FormErrorMessage>The username you entered is invalid.</FormErrorMessage>)}
              </FormControl>

              {/* password entry part of form */}
              <FormControl isInvalid={this.state.passwordError}>
                <FormLabel htmlFor='password'> </FormLabel>
                <InputGroup>
                  <Input
                    pr='4.5rem'
                    type={this.state.show ? 'text' : 'password'}
                    placeholder='Enter password'
                    style={{ color: 'darkturquoise' }}
                    name="Password"
                    value={this.state.user.Password}
                    onChange={this.changeHandler}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button colorScheme='black' bg='darkturquoise' h='1.75rem' size='sm' onClick={this.handleClick}>
                      {this.state.show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {!this.state.passwordError ? (<FormHelperText> </FormHelperText>)
                  : (<FormErrorMessage>Your password was incorrect</FormErrorMessage>)}
              </FormControl>

            </form>
            <Center paddingTop={'2vh'}>
              <Popover>
                <PopoverTrigger>
                  <Button colorScheme='black' onClick={this.loginUser} fontSize={25}
                    bg='mediumturquoise'>Submit</Button>
                </PopoverTrigger>
                <PopoverContent bg='black' fontWeight='bold' fontSize={16} style={{ color: 'mediumturquoise' }}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  {!this.state.axiosError ? (<PopoverHeader>Logging in...</PopoverHeader>)
                    : (<PopoverHeader> {this.state.loginError} </PopoverHeader>)}
                </PopoverContent>
              </Popover>
            </Center>
            <Center>
            <Box
              as='button'
              height='24px'
              lineHeight='1.2'
              transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
              border='none'
              px='8px'
              borderRadius='2px'
              fontSize='14px'
              fontWeight='semibold'
              bg='none'
              borderColor='#ccd0d5'
              color='mediumturquoise'
              _hover={{ bg: '#ebedf0' }}
              onClick={this.forgotPassword}
            >
              Forgot your password?
            </Box>
            </Center>
            
          </Box>
        </Center>
      </div >
    );
  }
}
export default Login;