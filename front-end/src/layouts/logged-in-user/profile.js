import axios from 'axios'
import React from 'react'
import '../../styles/profile.css'
import Post from '../../components/feed/post/post'
import posts from '../../components/feed/posts'
import { Center, Stack } from '@chakra-ui/react'

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            bio: '',
            numTagsFollowing: 0,
            numFollowing: 0,
            numFollowers: 0,
            viewingSelf: true,
            userExists: true,
        }
    }

    postHandler(posts) {
        console.log(posts.posts)
        return posts.posts.map((post) => {
            return (
                <div
                    style={{
                        overflowX: 'hidden',
                        overflowY: 'scroll',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Center bg={'#151516'} pb={20}>
                        <Post post={post} />
                    </Center>
                </div>
            )
        })
    }

    componentDidMount() {
        var sessionUsername = sessionStorage.getItem('username')
        var userViewing = this.props.username
            ? this.props.username
            : sessionUsername
        console.log(userViewing)
        axios
            .get('http://localhost:5000/api/getProfile/' + userViewing)
            .then((res) => {
                this.setState({
                    username: this.props.username,
                    bio: res.data.bio,
                    numTagsFollowing: this.formatNum(69),
                    numFollowing: this.formatNum(420000),
                    numFollowers: this.formatNum(44444444),
                    // numTagsFollowing: this.formatNum(res.data.numTagsFollowing),
                    // numFollowing: this.formatNum(res.data.numFollowing),
                    // numFollowers: this.formatNum(res.data.numFollowers),
                    viewingSelf:
                        sessionUsername != null &&
                        sessionUsername.localeCompare(this.props.username) ===
                            0,
                })
            })
            .catch(({ response }) => {
                if (response.data === "User doesn't exist") {
                    this.setState({
                        userExists: false,
                    })
                }
            })
    }

    formatNum(num) {
        return Intl.NumberFormat('en', { notation: 'compact' }).format(num)
    }

    render() {
        return (
            <div
                className="profile-page"
                style={{
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    width: '100%',
                    height: '100%',
                }}
            >
                {this.state.userExists ? (
                    <div>
                        <div className="container justify-content-center profile-page-container">
                            <div className="row justify-content-center">
                                <div className="col-3">
                                    <div class="rect-img-container">
                                        <img
                                            class="rect-img rounded-circle"
                                            src="https://picsum.photos/800/1500"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="col-7">
                                    <div className="profile-content">
                                        <div className="profile-page-header">
                                            <div className="profile-username">
                                                <h1>
                                                    <b>{this.state.username}</b>
                                                </h1>
                                            </div>
                                        </div>
                                        <div className="numbers">
                                            <div>
                                                <p>
                                                    <b>
                                                        {
                                                            this.state
                                                                .numTagsFollowing
                                                        }
                                                    </b>{' '}
                                                    Tags
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <b>
                                                        {
                                                            this.state
                                                                .numFollowers
                                                        }
                                                    </b>{' '}
                                                    Followers
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <b>
                                                        {
                                                            this.state
                                                                .numFollowing
                                                        }
                                                    </b>{' '}
                                                    Following
                                                </p>
                                            </div>
                                        </div>
                                        <div className="profile-bio">
                                            <p
                                                style={{
                                                    'overflow-wrap': 'anywhere',
                                                }}
                                            >
                                                My Bio: {this.state.bio}
                                            </p>
                                        </div>

                                        <div className="profile-buttons">
                                            {this.state.viewingSelf ? (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                    >
                                                        Edit Profile
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                    >
                                                        Follow/Unfollow
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                    >
                                                        DM
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                    >
                                                        Block
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row activity-row justify-content-center">
                                <div
                                    className="col-10 "
                                    style={{ 'background-color': 'white' }}
                                >
                                    <p style={{ color: 'black' }}>
                                        Posts go here
                                    </p>

                                    {sessionStorage.getItem('username') ==
                                    null ? (
                                        <div>Not logged in</div>
                                    ) : this.state.viewingSelf ? (
                                        <div>Viewing my own profile</div>
                                    ) : (
                                        <div>
                                            Logged in viewing another profile
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="posts-container">
                            {this.postHandler(posts)}
                        </div>
                    </div>
                ) : (
                    <div className="container justify-content-center profile-page-container">
                        <div className="row justify-content-center">
                            <div className="col-10" style={{ padding: '40px' }}>
                                <h3
                                    style={{
                                        'font-size': '60px',
                                        'margin-bottom': '20px',
                                    }}
                                >
                                    User Not Found
                                </h3>
                                <p>
                                    The user you were looking for could not be
                                    found.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
export default Profile
