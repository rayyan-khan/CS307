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
  Textarea,
  Checkbox
} from '@chakra-ui/react'

import React from 'react'
const axios = require('axios');


class CreatePost extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      postText: '',
      anonymous: 0,
      selectedFile: null,
      postError: false


    }
  }

  handlePostTextChange = (event) => {
    this.setState({
      postText: event.target.value
    })
  }

  makeAnonymous = (event) => {
    var checkBox = document.getElementById("checkbox");
    if (checkBox.checked === true) {
      this.setState({ anonymous: 1 })
    } else {
      this.setState({ anonymous: 0 })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.postText.trim() === '') {
      this.setState({ postError: true })
      return;
    }

    const data = new FormData();
    data.append('image', this.state.selectedFile);
    data.append('anonymous', this.state.anonymous);
    data.append('caption', this.state.postText);
    let url = window.location.href;
    if (this.state.selectedFile === null) {
      let jsonObj = {}
      jsonObj['anonymous'] = this.state.anonymous;
      jsonObj['caption'] = this.state.postText;

      axios.post("http://localhost:5000/api/posts/postNoImage", jsonObj).then((response) => {
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
      })
    } else {
      axios.post("http://localhost:5000/api/posts/postImage", data).then((response) => {
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
      })
    }

  }

  fileSelecteHandler = (events) => {
    this.setState({
      selectedFile: events.target.files[0]
    })
  }


  // 
  // 
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <form>
            <div>
              <FormControl isInvalid={this.state.postError}>
                <h2>Post Caption </h2>
                <Textarea
                  size="lg"
                  focusBorderColor='teal.200'
                  errorBorderColor='red.300'
                  placeholder='Enter Post Caption Here'
                  type="text"
                  name="postCaption"
                  value={this.state.postText}
                  onChange={this.handlePostTextChange}
                  rows="3"
                  maxLength="150"
                  style={{ color: 'darkturquoise' }}
                />
                {!this.state.postError ? (<FormHelperText> </FormHelperText>)
                  : (<FormErrorMessage>Please enter a non-empty post Caption.</FormErrorMessage>)}

                <h2>Upload Image</h2>
                <Input type='file'
                  accept="image/*"
                  onChange={this.fileSelecteHandler} />
              </FormControl>

              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="checkbox" onClick={this.makeAnonymous} />
                <label className="form-check-label">Make Anonymous</label>
              </div>

              <Popover>
                <PopoverTrigger>
                  <Button colorScheme='black' onClick={this.handleSubmit} fontSize={25}
                    bg='mediumturquoise' style={{ transform: "translateY(2vh)" }} >Submit</Button>
                </PopoverTrigger>
                <PopoverContent bg='black' fontWeight='bold' fontSize={18}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </header>
      </div>
    );
  }
}
export default CreatePost;