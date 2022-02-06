import axios from 'axios';
import React from 'react'
import '../../styles/profile.css'
import Post from '../../components/feed/post/post';
import posts from '../../components/feed/posts';

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

    postHandler(posts) {
        console.log(posts.posts);
        return posts.posts.map((post) => {
            return (
                <div>
                    <Post
                        post={post}
                    />
                </div>
            )
        }
        );
    }

    componentDidMount() {
        var sessionUsername = sessionStorage.getItem("username")
        var userViewing = this.props.username ? this.props.username : sessionUsername;
        console.log(userViewing)
        axios.get('http://localhost:5000/api/dummy-get-profile/' + userViewing)
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
            <div className='profile-page'>
                <div className='container justify-content-center profile-page-container'>
                    <div className='row justify-content-center'>
                        <div className='col-3'>
                            <div class="rect-img-container">
                                <img class="rect-img rounded-circle" src='https://picsum.photos/800/1500' alt="" />
                            </div>
                        </div>
                        <div className='col-7'>
                            <div className='profile-content'>
                                <div className='profile-page-header'>
                                    <div className='profile-username'>
                                        <h1><b>{this.state.username}</b></h1>
                                    </div>
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
                                <div className='profile-bio'>
                                    <p style={{ 'overflow-wrap': 'anywhere' }}>My Bio: {this.state.bio}</p>
                                </div>

                                <div className='profile-buttons'>
                                    {
                                        this.state.viewingSelf ?
                                            <div>
                                                <button type="button" className='btn btn-primary'>Edit Profile</button>
                                            </div>
                                            :
                                            <div>
                                                <button type="button" className="btn btn-primary">Follow/Unfollow</button>
                                                <button type="button" className="btn btn-dark">DM</button>
                                                <button type="button" className="btn btn-danger">Block</button>
                                            </div>
                                    }
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
                <div className='posts-container'>
                    {this.postHandler(posts)}
                </div>
            </div>
        );
    }
}
export default Profile;