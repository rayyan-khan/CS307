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

class ResetPassword extends React.Component {

    constructor(props) {
        super();
        this.state = {
            email: ''
        }
    }

    changeHandler = e => {
        const name = e.target.name;
        const value = e.target.value;
        //console.log(value);

        this.setState({email: value});
    }

    resetPassword = () => {
        console.log("Clicked submit");

        // axios stuff

    }

  render() {
    return (
      <div className="App">

        <Center>
          <Box paddingTop={'35vh'} width={'20vw'} height={'90vh'}>
            <Center>
              <Text fontSize={'3xl'} style={{ color: 'mediumturquoise' }}>Reset Your Password</Text>
            </Center>
            <p></p>
            <form>

              {/* username entry part of form */}
              <FormControl isInvalid={this.state.userError}>
                <FormLabel htmlFor='email'> </FormLabel>
                <Input
                  focusBorderColor='teal.200'
                  errorBorderColor='red.300'
                  placeholder='Enter your email'
                  type="text"
                  name="Email"
                  value={this.state.email}
                  onChange={this.changeHandler}
                  style={{ color: 'darkturquoise' }} />
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
                  <PopoverHeader>If this is an email associated with a PurdueCircle account,
                       we have sent you an email to finish resetting your password.</PopoverHeader>
                </PopoverContent>
              </Popover>
            </Center>

          </Box>
        </Center>

      </div>
    );
  }
}
export default ResetPassword;