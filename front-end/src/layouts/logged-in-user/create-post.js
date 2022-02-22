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
      postError: false,
      hyperlink: '',
      hyperlinkError: false

    }
  }

  componentWillMount() {
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
  }

  handlePostTextChange = (event) => {
    this.setState({
      postText: event.target.value
    })
  }

  handleHyperlinkChange = (event) => {
    this.setState({
      hyperlink: event.target.value
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

    if (this.state.hyperlink.trim() != '' && !this.isValidHttpUrl(this.state.hyperlink)) {
      this.setState({ hyperlinkError: true })
      return;
    }

    const data = new FormData();
    data.append('image', this.state.selectedFile);
    data.append('anonymous', this.state.anonymous);
    data.append('caption', this.state.postText);
    data.append('hyperlink', this.state.hyperlink);
    data.append('token', sessionStorage.getItem('token'))

    let url = window.location.href;
    if (this.state.selectedFile === null) {
      let jsonObj = {}
      jsonObj['anonymous'] = this.state.anonymous;
      jsonObj['caption'] = this.state.postText;
      jsonObj['hyperlink'] = this.state.hyperlink;
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


  isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
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
                <h2 style={{ color: "white" }}>Post Caption </h2>
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

              </FormControl>

              <FormControl isInvalid={this.state.hyperlinkError}>
                <h2 style={{ color: "white" }}>Hyperlink </h2>
                <Input
                  size="lg"
                  focusBorderColor='teal.200'
                  errorBorderColor='red.300'
                  placeholder='Enter Hyperlink Here'
                  type="text"
                  name="hyperlink"
                  value={this.state.hyperlink}
                  onChange={this.handleHyperlinkChange}
                  style={{ color: 'darkturquoise' }}
                />
                {!this.state.hyperlinkError ? (<FormHelperText> </FormHelperText>)
                  : (<FormErrorMessage>Please enter a valid hyperlink or leave it blank.</FormErrorMessage>)}

              </FormControl>

              <FormControl>
                <h2 style={{ color: "white" }}>Upload Image</h2>
                <Input style={{ color: "white" }} type='file'
                  accept="image/*"
                  onChange={this.fileSelecteHandler} />
              </FormControl>

              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="checkbox" onClick={this.makeAnonymous} />
                <label style={{ color: "white" }} className="form-check-label">Make Anonymous</label>
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