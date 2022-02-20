import React from 'react'
const axios = require('axios');


class CreatePost extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      postText: '',
      anonymous: '',
      selectedFile: null


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

    const data = new FormData();
    data.append('image', this.state.selectedFile);
    data.append('anonymous', this.state.anonymous);
    data.append('caption', this.state.postText);

    if (this.state.selectedFile === null) {
      let jsonObj = {}
      jsonObj['anonymous'] = this.state.anonymous;
      jsonObj['caption'] = this.state.postText;
      axios.post("https://still-sierra-32456.herokuapp.com/api/posts/postNoImage", jsonObj)
    } else {
      axios.post("https://still-sierra-32456.herokuapp.com/api/posts/postImage", data);
    }
    let url = window.location.href;
    window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
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
          <form onSubmit={this.handleSubmit}>
            <div>
              <div className="form-group row">
                <label>Post Text:</label>
                <textarea className="textA" type='text' value={this.state.postText}
                  onChange={this.handlePostTextChange} rows="3" maxLength="150"> </textarea>
              </div>
              <div className="form-group row">
                <label>Upload Image:</label>
                <input type='file'
                  onChange={this.fileSelecteHandler} />
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="checkbox" onClick={this.makeAnonymous} />
                <label className="form-check-label">Make Anonymous</label>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </header>
      </div>
    );
  }
}
export default CreatePost;