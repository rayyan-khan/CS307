import axios from 'axios';
import React from 'react'
import logo from '../../logo.png';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            bio: '',
            numTagsFollowing: 0,
            numFollowing: 0,
            numFollowers: 0,
            viewingSelf: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/dummy-get-profile/' + sessionStorage.getItem("username"))
        .then(res => {
            this.setState({
                username: this.props.username,
                bio: res.data.bio,
                numTagsFollowing: this.formatNum(res.data.numTagsFollowing),
                numFollowing: this.formatNum(res.data.numFollowing),
                numFollowers: this.formatNum(res.data.numFollowers),
                viewingSelf: sessionStorage.getItem('username') != null &&
                    sessionStorage.getItem('username').localeCompare(this.props.username) === 0
            })
        })        
    }

    formatNum(num) {
        return Intl.NumberFormat('en', { notation: 'compact' }).format(num)
    }

    render() {
        return (
            <div className="App">
                <header className="App-header" style={{'justify-content': 'normal'}}>
                    <div className='container'>
                        <div className='row justify-content-center'>
                            <div className='col-3'>
                                <img src={logo} className="img-fluid" alt="logo" />
                            </div>
                            <div className='col-8'>
                                <p>This is the profile page for {this.state.username}</p>
                                <p><b>{this.state.numTagsFollowing}</b> Tags Following
                                    - <b>{this.state.numFollowers}</b> Followers
                                    - <b>{this.state.numFollowing}</b> Following</p>
                                <p style={{ 'overflow-wrap': 'anywhere' }}>My Bio: {this.state.bio}</p>

                                {
                                    sessionStorage.getItem("username") == null ?
                                        <div>Not logged in</div>
                                        :
                                        this.state.viewingSelf ?
                                            <div>Viewing my own profile</div>
                                            :
                                            <div>Logged in viewing another profile: follow/unfollow, block, dm</div>
                                }
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <div className='col-10 ' style={{'background-color': 'white'}} >
                                <p style={{'color': 'black'}}>Posts go here</p>
                            </div>
                    </div>
            </div>
                </header >
            </div >
        );
    }
}
export default Profile;