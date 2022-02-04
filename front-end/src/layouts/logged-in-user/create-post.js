import React from 'react'

class CreatePost extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {
      postText: '',
      anonymous: '',


    }
  }

  handlePostTextChange = (event) => {
    this.setState({
      postText: event.target.value
    })
  };

  makeAnonymous = (event) => {
    var checkBox = document.getElementById("checkbox");
    if (checkBox.checked === true) {
      this.setState({anonymous: true})
    } else {
      this.setState({anonymous: false})
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let jsonObj = {};
    jsonObj['anonymous'] = this.state.anonymous;
    jsonObj['postText'] = this.state.postText;

    // axios.post("http://localhost:5000/api/testing", jsonObj);

  }


  // 
  // 
  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit= {this.handleSubmit}> 
            <div>
              <div className="form-group row">
              <label>Post Text:</label>
              <textarea type = 'text' value= {this.state.postText} 
               onChange= {this.handlePostTextChange} rows="3" maxlength="150"> </textarea>
               </div>
               <div class="form-check">
                  <input type="checkbox" className="form-check-input" id = "checkbox" onClick = {this.makeAnonymous}/>
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