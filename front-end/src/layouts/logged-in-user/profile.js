import axios from 'axios';
import React from 'react'
import logo from '../../logo.png';
import '../../styles/profile.css'

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            bio: '',
            numTagsFollowing: 0,
            numFollowing: 0,
            numFollowers: 0,
            viewingSelf: true
        }
    }

    componentDidMount() {
        var sessionUsername = sessionStorage.getItem("username")
        axios.get('http://localhost:5000/api/dummy-get-profile/' + sessionUsername)
            .then(res => {
                this.setState({
                    username: this.props.username,
                    bio: res.data.bio,
                    numTagsFollowing: this.formatNum(res.data.numTagsFollowing),
                    numFollowing: this.formatNum(res.data.numFollowing),
                    numFollowers: this.formatNum(res.data.numFollowers),
                    viewingSelf: sessionUsername != null && sessionUsername.localeCompare(this.props.username) === 0
                })
            })
    }

    formatNum(num) {
        return Intl.NumberFormat('en', { notation: 'compact' }).format(num)
    }

    render() {
        return (
            <div className="App">
                <header className="App-header" style={{ 'justify-content': 'normal' }}>
                    <div className='container profile-page-container'>
                        <div className='row justify-content-center'>
                            <div className='col-3'>
                                <img src={logo} className="img-fluid" alt="logo" />
                            </div>
                            <div className='col-7'>
                                <div className='profile-content'>
                                    <div className='profile-page-header'>
                                        <h1><b>{this.state.username}</b></h1>
                                        <p>
                                            {
                                                sessionStorage.getItem("username") != null && !this.state.viewingSelf ?
                                                    <div>
                                                        <button type="button" class="btn btn-primary">Follow/Unfollow</button>
                                                        <button type="button" class="btn btn-dark">DM</button>
                                                        <button type="button" class="btn btn-danger">Block</button>
                                                    </div>
                                                    :
                                                    <div></div>
                                            }
                                        </p>
                                    </div>
                                    <div className='numbers'>
                                        <div>
                                            <p><b>{this.state.numTagsFollowing}</b> Tags</p>
                                        </div>
                                        <div>
                                            <p><b>{this.state.numFollowers}</b> Followers</p>
                                        </div>
                                        <div>
                                            <p><b>{this.state.numFollowing}</b> Following</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ 'overflow-wrap': 'anywhere' }}>My Bio: {this.state.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row activity-row justify-content-center'>
                            <div className='col-10 ' style={{ 'background-color': 'white' }} >
                                <p style={{ 'color': 'black' }}>Posts go here</p>

                                {
                                    sessionStorage.getItem("username") == null ?
                                        <div>Not logged in</div>
                                        :
                                        this.state.viewingSelf ?
                                            <div>Viewing my own profile</div>
                                            :
                                            <div>Logged in viewing another profile</div>
                                }
                            </div>
                        </div>
                    </div>
                </header >
            </div >
        );
    }
}
export default Profile;