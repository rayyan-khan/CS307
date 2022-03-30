import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputGroup,
    InputRightElement,
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
    transform,
    Box,
    Center,
    Stack,
    Text,
  } from '@chakra-ui/react'
  import React, { useEffect, useState } from 'react'
  
  import logo from '../../logo.png';
  import "bootstrap/dist/css/bootstrap.min.css";
  import { useAnimationFrame } from 'framer-motion';
  import '../layouts.css';
import axios from 'axios';

class Recovery extends React.Component {

    constructor(props) {
        super();
        this.state = {
            password: '',
            confirmPassword: '',
            passwordsMatch: true,
            passwordMeetsRequirements: true,
            show: false,
        }
    }

    changeHandler = e => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value});
    }

    resetPassword = () => {
        this.setState({ displayPopover: true});
        console.log("Clicked submit");

        // check that passwords match
        // check if passwords match
        if (this.state.password === this.state.confirmPassword) {
            console.log("Passwords Match");
            this.setState({ passwordsMatch: true })
        }else {
            // have pop up show passwords do not match
            console.log("Passwords do not match");
            this.setState({ passwordsMatch: false });
        }

        // check that passwords meet requirements
        // check if password is valid (at least 8 characters 1 letter and 1 number)
        let checkPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (checkPassword.test(this.state.password)) {
            console.log("Password meets requirements");
            this.setState({ passwordMeetsRequirements: true })
        }
        else {
            console.log("Password does not meet requirements");
            this.setState({ passwordMeetsRequirements: false })
        }

        // axios stuff
        axios.put("http://localhost:5000/api/recoverPassword", 
        {newPassword: this.state.password},
            {headers: {recover_token: this.props.token}}).then(res => {
            console.log(res)
        }).catch(err => { 
            console.log(err)
        })

    }
    
    handleClick = () => {
        console.log("Show clicked");
        this.setState({ show: !this.state.show });
    }

  render() {
    return (
      <div className="App">

        <Center>
          <Box paddingTop={'25vh'} width={'30vw'} height={'90vh'}>
            <Center>
              <Text fontSize={'3xl'} style={{ color: 'mediumturquoise' }}>Make a New Password</Text>
            </Center>
            <p></p>
            <form>

            <FormControl>
                <FormLabel htmlFor='password'></FormLabel>
                <InputGroup>
                    <Input
                        focusBorderColor='teal.200'
                        errorBorderColor='red.300'
                        placeholder='Password'
                        name="password"
                        value={this.state.password}
                        onChange={this.changeHandler}
                        style={{ color: 'darkturquoise' }}
                        type={this.state.show ? 'text' : 'password'} />
                      <InputRightElement width='4.5rem'>
                        <Button colorScheme='black' bg='darkturquoise' h='1.75rem' size='sm' onClick={this.handleClick}>
                          {this.state.show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                </InputGroup>
                {this.state.passwordMeetsRequirements ? (<FormHelperText> Make a good password if you don't want to get hacked. </FormHelperText>)
                : (<FormHelperText style={{ color: 'red' }}>Enter a valid password (must be at least 8 characters and have at least 1 letter and 1 number).</FormHelperText>)}
            </FormControl>

                  {/* passwordCheck entry part of form */}
                  <FormControl isInvalid={this.state.passwordCheckError}>
                    <FormLabel htmlFor='passwordCheck'> </FormLabel>
                    <InputGroup>
                      <Input
                        focusBorderColor='teal.200'
                        errorBorderColor='red.300'
                        placeholder='Retype your password'
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.changeHandler}
                        style={{ color: 'darkturquoise' }}
                        type={this.state.show ? 'text' : 'password'}
                        pr='4.5rem'
                      />
                      <InputRightElement width='4.5rem'>
                        <Button colorScheme='black' bg='darkturquoise' h='1.75rem' size='sm' onClick={this.handleClick}>
                          {this.state.show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {this.state.passwordsMatch ? (<FormHelperText>Make sure this password matches the one above. </FormHelperText>)
                      : (<FormHelperText style={{ color: 'red' }}>Your password doesn't match the one above.</FormHelperText>)}
                  </FormControl>
              
            </form>

            <Center paddingTop={'2vh'}>
              <Popover>
                <PopoverTrigger>
                  <Button colorScheme='black' onClick={this.resetPassword} fontSize={20}
                    bg='mediumturquoise'>Submit</Button>
                </PopoverTrigger>
                <PopoverContent bg='white' fontWeight='bold' fontSize={16} style={{ color: 'mediumturquoise' }}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Your password has been reset.</PopoverHeader>
                </PopoverContent>
              </Popover>
            </Center>

          </Box>
        </Center>

      </div>
    );
  }
}
export default Recovery;