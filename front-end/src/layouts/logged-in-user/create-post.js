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
  Checkbox,
  Box,
  Text,
  Stack
} from '@chakra-ui/react'

import React, { Fragment } from 'react'
import ReactSelect from 'react-select';
import '../layouts.css';
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
      hyperlinkError: false,
      tags: [],
      tagSearch: '',
      tagSelected: "null",

    }
  }

  getTags() {
    try {
      axios.get("http://localhost:5000/api/getTags/").then((res) => {
        this.setState({ tags: res.data });
      });

    } catch (error) {
      console.log(error);

    }
  }

  checkTag(tag) {
    for (let i = 0; i < this.state.tags.length; i++) {
      if (this.state.tags[i].tagID === tag) {
        return true;
      }
    }
    return false;
  }

  createTag = (tag) => {
    if (tag.length > 0 && tag.length < 20 && !this.checkTag(tag)) {
      console.log('creating tag');
      try {
        axios.get("http://localhost:5000/api/createTag/" + tag).then((res) => {
          this.getTags();
        });

      } catch (error) {
        console.log(error);

      }
    }
  }

  componentWillMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    this.getTags();
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
    if (this.state.anonymous === 0) {
      this.setState({
        anonymous: 1
      })
      console.log("making anonymous")
    } else {
      this.setState({
        anonymous: 0
      })
      console.log("not making anonymous")
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();


    if (this.state.postText.trim() === '') {
      this.setState({ postError: true })
      return;
    } else {
      this.setState({ postError: false })
    }

    if (this.state.hyperlink.trim() != '' && !this.isValidHttpUrl(this.state.hyperlink)) {
      this.setState({ hyperlinkError: true })
      return;
    } else {
      this.setState({ hyperlinkError: false })
    }

    const data = new FormData();
    data.append('image', this.state.selectedFile);
    data.append('anonymous', this.state.anonymous);
    data.append('caption', this.state.postText);
    data.append('tag', this.state.postText);
    data.append('hyperlink', this.state.hyperlink);
    data.append('token', localStorage.getItem('token'))
    data.append('tag', this.state.tagSelected)

    let url = window.location.href;
    if (this.state.selectedFile === null) {
      let jsonObj = {}
      jsonObj['anonymous'] = this.state.anonymous;
      jsonObj['caption'] = this.state.postText;
      jsonObj['hyperlink'] = this.state.hyperlink;
      jsonObj['tag'] = this.state.tagSelected;
      console.log(jsonObj);
      axios.post("http://localhost:5000/api/posts/postNoImage", jsonObj).then((response) => {
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
      })
    } else {
      console.log(data);
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

  onChange = (selectedOption) => {
    this.setState({
      tagSelected: selectedOption.tagID
    })
  }

  onInputChange = (input) => {
    console.log(input);
    this.setState({ tagSearch: input });
  }

  onKeyDown = (event) => {
    if (event.code == "Enter") {
      this.setState({ tagSelected: this.state.tagSearch });
      console.log("Stuff", this.state.tagSearch)
      this.createTag(this.state.tagSearch);
    }
  }


  // 
  // 
  render() {

    return (
      <div className="color-switch">
        <header className="App-header">
          <form>
            <div>
              <FormControl isInvalid={this.state.postError}>
                <h2 style={{ color: "var(--text-color)" }}>Post Caption </h2>
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
                <h2 style={{ color: "var(--text-color)" }}>Hyperlink </h2>
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
                <h2 style={{ color: "var(--text-color)" }}>Upload Image</h2>
                <Input paddingTop={'4px'} style={{ color: "white" }} type='file'
                  accept="image/*"
                  onChange={this.fileSelecteHandler} />
              </FormControl>

              <FormControl pt={3} isInvalid={this.state.hyperlinkError}>
                <h2 style={{ color: "var(--text-color)", paddingBottom: 5 }}>Tag </h2>
                <Fragment >
                  <ReactSelect
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable
                    isSearchable
                    name="color"
                    options={this.state.tags}
                    getOptionLabel={(option) => {
                      return `#${option.tagID}`
                    }}
                    formatOptionLabel={"FormatOptionLabel"}
                    onChange={this.onChange}
                    onInputChange={this.onInputChange}
                    placeholder="#"
                    onKeyDown={this.onKeyDown}
                    noOptionsMessage={() => 'Create #' + this.state.tagSearch}
                    styles={{
                      input: (provided) => ({
                        ...provided,
                        color: 'gray',
                      }),
                      option: provided => ({
                        ...provided,
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: 'var(--bg-color)',
                      }),
                      noOptionsMessage: provided => ({
                        ...provided,
                        color: 'black',
                        borderColor: 'var(--bg-color)',
                      }),

                      singleValue: provided => ({
                        ...provided,
                        color: 'var(--text-color)'
                      }),
                      control: base => ({
                        ...base,
                        backgroundColor: 'var(--bg-color)',
                        borderColor: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        textEmphasisColor: 'var(--text-color)',
                        textDecorationColor: 'var(--text-color)',
                      }),
                      dropdownIndicator: (styles) => ({
                        ...styles,
                        paddingTop: 3,
                        paddingBottom: 3,
                        backgroundColor: 'var(--bg-color)',
                        borderColor: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        textEmphasisColor: 'var(--text-color)',
                        textDecorationColor: 'var(--text-color)',
                      }),
                      clearIndicator: (styles) => ({
                        ...styles,
                        paddingTop: 3,
                        paddingBottom: 3,
                      }),

                    }}
                  />
                </Fragment>
                {!this.state.hyperlinkError ? (<FormHelperText> </FormHelperText>)
                  : (<FormErrorMessage>Please enter a valid hyperlink or leave it blank.</FormErrorMessage>)}

              </FormControl>

              <Box>
                <Stack direction={'row'}>
                  <Checkbox checked={this.state.anonymous == 1 ? true : false} onChange={(e) => {
                    this.setState({
                      anonymous: e.target.checked ? 1 : 0
                    })
                  }} />
                  <Text style={{ color: "var(--text-color)" }} className="form-check-label">Make Anonymous</Text>
                </Stack>
              </Box>

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