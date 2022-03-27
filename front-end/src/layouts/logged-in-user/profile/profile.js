import axios from 'axios'
import React from 'react'
import Post from '../../../components/feed/post/post'
import {
    Box,
    Button,
    Center,
    Image,
    Stack,
    Text,
    Input,
    IconButton,
    Avatar,
    Tooltip,
} from '@chakra-ui/react'
import '../../layouts.css'
import { IoSettingsOutline } from 'react-icons/io5'

import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import '../../layouts.css'
import '../../../styles/profile.css'
import Settings from './settings/settings'
import PostInteraction from '../../../components/feed/post/postInteraction'
import ProfilePicture from '@dsalvagni/react-profile-picture'
import '@dsalvagni/react-profile-picture/dist/ProfilePicture.css'

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                username: '',
                bio: '',
                firstName: '',
                lastName: '',
                numTagsFollowing: 0,
                numFollowing: 0,
                numFollowers: 0,
                profilePic: '',
                section: '',
            },
            editedBio: '',
            allPosts: [],
            viewingSelf: true,
            userExists: true,
            loading: true,
            allPosts: [],
            postInteractions: [],
            editMode: false,
            open: false,
            showPosts: true,
        }
    }

    async fetchPosts() {
        try {
            console.log(this.state.user.username)
            let url =
                'http://localhost:5000/api/getPostsByUser/' +
                this.state.user.username
            console.log(url)
            await axios
                .get(url)
                .then((res) => {
                    console.log(this.state.user.username)
                    console.log(res.data)
                    const posts = res.data.filter((post) => {
                        console.log(post)
                        console.log(post.username === this.state.user.username)
                        return post.username === this.state.user.username
                    })
                    console.log(posts)
                    this.setState({ allPosts: posts })
                    return
                })
                .catch(function (error) {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    fetchInteractions() {
        try {
            let url =
                'http://localhost:5000/api/postInteractions/' +
                this.state.user.username
            axios
                .get(url)
                .then((res) => {
                    const postInteractions = res.data.filter(
                        (postInteraction) => {
                            return true
                        }
                    )
                    this.setState({ postInteractions: postInteractions })
                })
                .catch(function (error) {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    postHandler() {
        if (this.state.allPosts.length === 0) {
            return <Center>No posts to show.</Center>
        }

        return this.state.allPosts.map((post, key) => {
            return (
                <Center pb={5}>
                    <Post post={post} />
                </Center>
            )
        })
    }

    postInteractionsHandler() {
        if (this.state.postInteractions.length === 0) {
            return <Center>No interactions to show.</Center>
        }
        return this.state.postInteractions.map((post, key) => {
            return (
                <Center pb={1}>
                    <PostInteraction post={post} />
                </Center>
            )
        })
    }

    firstNameHandler(e) {
        this.setState({ firstName: e.target.value })
    }

    lastNameHandler(e) {
        this.setState({ lastName: e.target.value })
    }

    async componentDidMount() {
        console.log('test')

        if (axios.defaults.headers.common['authorization'] != null) {
            var sessionUsername
            await axios
                .get('http://localhost:5000/api/getUserFromHeader')
                .then((res) => {
                    console.log('lala')
                    sessionUsername = res.data.username
                })
        }

        var userViewing = await (this.props.username
            ? this.props.username
            : sessionUsername)
        this.setState({ username: userViewing })
        console.log(userViewing)
        var popoverContent
        await axios
            .get('http://localhost:5000/api/getProfile/' + userViewing)
            .then((res) => {
                console.log(res.data)
                this.setState({
                    user: {
                        username: userViewing,
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        bio: res.data.bio,
                        editedBio: res.data.bio,
                        firstName: res.data.firstName ? res.data.firstName : '',
                        lastName: res.data.lastName ? res.data.lastName : '',
                        numTagsFollowing: this.formatNum(6900),
                        numFollowing: this.formatNum(420000),
                        numFollowers: this.formatNum(44444444),
                        email: res.data.email,
                        profilePic: res.data.url,
                    },
                    following: res.data.following,
                })

                this.setState({
                    viewingSelf:
                        sessionUsername != null &&
                        sessionUsername.localeCompare(userViewing) === 0,
                    loading: false,
                })
                return
            })
            .catch(({ response }) => {
                if (response.data === "User doesn't exist") {
                    this.setState({
                        userExists: false,
                        loading: false,
                    })
                }
            })
        await this.fetchPosts()

        await this.fetchInteractions()
    }

    formatNum(num) {
        return Intl.NumberFormat('en', { notation: 'compact' }).format(num)
    }

    toPosts = () => {
        console.log('toPosts')
        this.setState({ showPosts: true })
    }

    toInteractions = () => {
        console.log('toInteractions')
        this.setState({ showPosts: false })
    }

    updateFollowing = () => {
        if (!this.state.following) {
            axios
                .post('http://localhost:5000/api/followUser', {
                    followed: this.state.user.username,
                })
                .then((res) => {
                    this.setState({ following: true })
                })
        } else {
            axios
                .post('http://localhost:5000/api/unfollowUser', {
                    followed: this.state.user.username,
                })
                .then(() => {
                    this.setState({ following: false })
                })
        }
    }

    Userline = () => {
        return (
            <div>
                <Stack pt={'7.5vh'} pb={'2.5vh'}>
                    <Center>
                        <div style={{ display: 'flex' }}>
                            <div
                                className={`toggle-title ${
                                    this.state.showPosts ? 'select-title' : ''
                                }`}
                                onClick={this.toPosts}
                            >
                                <Box>
                                    <Text
                                        color={'darkturquoise'}
                                        fontSize={'4xl'}
                                    >
                                        Posts
                                    </Text>
                                </Box>
                            </div>
                            <div
                                className={`toggle-title ${
                                    this.state.showPosts ? '' : 'select-title'
                                }`}
                                onClick={this.toInteractions}
                            >
                                <Box>
                                    <Text
                                        color={'darkturquoise'}
                                        fontSize={'4xl'}
                                    >
                                        Interactions
                                    </Text>
                                </Box>
                            </div>
                        </div>
                    </Center>
                </Stack>

                <div className="slide-container">
                    <Box
                        className={`slide ${
                            this.state.showPosts ? 'right-hide' : 'show'
                        }`}
                        style={{ paddingBottom: '80px' }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            {this.postInteractionsHandler()}
                        </div>
                    </Box>

                    <Box
                        style={{ paddingBottom: '80px' }}
                        className={`slide posts-container ${
                            this.state.showPosts ? 'show' : 'left-hide'
                        }`}
                    >
                        {this.postHandler()}
                    </Box>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div
                className="color-switch"
                style={{
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    width: '100%',
                    height: '100%',
                }}
            >
                {this.state.loading ? (
                    <div></div>
                ) : (
                    <div>
                        {this.state.userExists ? (
                            <>
                                <Center pt={'5vh'}>
                                    <Box>
                                        <Stack
                                            p={'20px'}
                                            bottom={'100px'}
                                            className="color-switch"
                                            boxShadow={'2xl'}
                                            rounded={'lg'}
                                            direction={'row'}
                                        >
                                            <Center>
                                                <Box on>
                                                    <Tooltip
                                                        label="Edit Picture"
                                                        aria-label="A tooltip"
                                                    >
                                                        <Avatar
                                                            name={
                                                                this.state.user
                                                                    .firstName +
                                                                ' ' +
                                                                this.state.user
                                                                    .lastName
                                                            }
                                                            borderRadius={
                                                                'full'
                                                            }
                                                            src={
                                                                this.state.user
                                                                    .profilePic
                                                            }
                                                            style={{
                                                                width: 100,
                                                                height: 100,
                                                                borderRadius:
                                                                    100 / 2,
                                                            }}
                                                            cursor={'pointer'}
                                                            _hover={{
                                                                backgroundColor:
                                                                    'darkturquoise',
                                                            }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    section:
                                                                        'profilePic',
                                                                    open: true,
                                                                })
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Box>
                                                <Box pl={'1vw'}>
                                                    <Stack direction={'column'}>
                                                        <Box>
                                                            <>
                                                                <Text
                                                                    fontSize={
                                                                        '2xl'
                                                                    }
                                                                    color={
                                                                        'var(--text-color)'
                                                                    }
                                                                >
                                                                    {
                                                                        this
                                                                            .state
                                                                            .user
                                                                            .firstName
                                                                    }{' '}
                                                                    {
                                                                        this
                                                                            .state
                                                                            .user
                                                                            .lastName
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    pl={'.15vw'}
                                                                    fontWeight={
                                                                        'bold'
                                                                    }
                                                                    color={
                                                                        'var(--text-color)'
                                                                    }
                                                                    fontSize={
                                                                        'xs'
                                                                    }
                                                                >
                                                                    @
                                                                    {
                                                                        this
                                                                            .state
                                                                            .user
                                                                            .username
                                                                    }
                                                                </Text>
                                                            </>
                                                        </Box>
                                                    </Stack>
                                                    <Stack
                                                        pt={'1vh'}
                                                        direction={'row'}
                                                    >
                                                        <Stack
                                                            direction={'row'}
                                                        >
                                                            <Text
                                                                fontWeight={
                                                                    'bold'
                                                                }
                                                                color={
                                                                    'var(--text-color)'
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .user
                                                                        .numTagsFollowing
                                                                }
                                                            </Text>
                                                            <Text color="var(--text-color)">
                                                                {' '}
                                                                Tags
                                                            </Text>
                                                        </Stack>
                                                        <Stack
                                                            direction={'row'}
                                                        >
                                                            <Text
                                                                fontWeight={
                                                                    'bold'
                                                                }
                                                                color={
                                                                    'var(--text-color)'
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .user
                                                                        .numFollowers
                                                                }
                                                            </Text>
                                                            <Text color="var(--text-color)">
                                                                {' '}
                                                                Followers
                                                            </Text>
                                                        </Stack>
                                                        <Stack
                                                            direction={'row'}
                                                        >
                                                            <Text
                                                                fontWeight={
                                                                    'bold'
                                                                }
                                                                color={
                                                                    'var(--text-color)'
                                                                }
                                                            >
                                                                {
                                                                    this.state
                                                                        .user
                                                                        .numFollowing
                                                                }
                                                            </Text>
                                                            <Text color="var(--text-color)">
                                                                {' '}
                                                                Following
                                                            </Text>
                                                        </Stack>
                                                    </Stack>
                                                    <Box pt={'1vh'}>
                                                        <Stack
                                                            direction={'row'}
                                                        >
                                                            <Text
                                                                fontWeight={
                                                                    'bold'
                                                                }
                                                                color={
                                                                    'var(--text-color)'
                                                                }
                                                            >
                                                                Bio:
                                                            </Text>
                                                            {this.state
                                                                .editMode ? (
                                                                <>
                                                                    <Input
                                                                        color="var(--text-color)"
                                                                        // border={'none'}
                                                                        height={
                                                                            '3.25vh'
                                                                        }
                                                                        width={
                                                                            'auto'
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .editedBio
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.setState(
                                                                                {
                                                                                    editedBio:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }
                                                                            )
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Text color="var(--text-color)">
                                                                        {
                                                                            this
                                                                                .state
                                                                                .user
                                                                                .bio
                                                                        }
                                                                    </Text>
                                                                </>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                    <Box pr={'5px'} pt={'1vh'}>
                                                        {this.state
                                                            .viewingSelf ? (
                                                            <Box>
                                                                {this.state
                                                                    .editMode ? (
                                                                    <>
                                                                        <Button
                                                                            backgroundColor={
                                                                                'red'
                                                                            }
                                                                            color={
                                                                                'white'
                                                                            }
                                                                            onClick={() => {
                                                                                console.log(
                                                                                    this
                                                                                        .state
                                                                                        .email
                                                                                )
                                                                                console.log(
                                                                                    'clicked'
                                                                                )
                                                                                axios.defaults.headers.common[
                                                                                    'authorization'
                                                                                ] =
                                                                                    localStorage.getItem(
                                                                                        'token'
                                                                                    )
                                                                                this.state.user.bio =
                                                                                    this.state.editedBio
                                                                                console.log(
                                                                                    this
                                                                                        .state
                                                                                        .user
                                                                                        .bio
                                                                                )
                                                                                try {
                                                                                    axios.put(
                                                                                        'http://localhost:5000/api/updateProfile',
                                                                                        {
                                                                                            bio: this
                                                                                                .state
                                                                                                .user
                                                                                                .bio,
                                                                                        }
                                                                                    )
                                                                                } catch (error) {
                                                                                    console.log(
                                                                                        error
                                                                                    )
                                                                                }
                                                                                this.setState(
                                                                                    {
                                                                                        editMode: false,
                                                                                    }
                                                                                )
                                                                            }}
                                                                        >
                                                                            Save
                                                                            Changes
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Button
                                                                            backgroundColor={
                                                                                '#5581D7'
                                                                            }
                                                                            color={
                                                                                'white'
                                                                            }
                                                                            onClick={() => {
                                                                                this.setState(
                                                                                    {
                                                                                        editMode: true,
                                                                                        editedBio:
                                                                                            this
                                                                                                .state
                                                                                                .user
                                                                                                .bio,
                                                                                    }
                                                                                )
                                                                            }}
                                                                        >
                                                                            Edit
                                                                            Bio
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                <IconButton
                                                                    left={'3'}
                                                                    style={{
                                                                        backgroundColor:
                                                                            '#1D2023',
                                                                        color: 'white',
                                                                    }}
                                                                    aria-label="Like"
                                                                    onClick={() => {
                                                                        this.setState(
                                                                            {
                                                                                section:
                                                                                    'profile',
                                                                                open: true,
                                                                            }
                                                                        )
                                                                    }}
                                                                    icon={
                                                                        <IoSettingsOutline />
                                                                    }
                                                                />
                                                                <Popup
                                                                    open={
                                                                        this
                                                                            .state
                                                                            .open
                                                                    }
                                                                    onClose={() => {
                                                                        this.setState(
                                                                            {
                                                                                open: false,
                                                                            }
                                                                        )
                                                                    }}
                                                                    contentStyle={{
                                                                        backgroundColor:
                                                                            'var(--main-color)',
                                                                        borderWidth:
                                                                            '0px',
                                                                        borderRadius:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    {
                                                                        <Settings
                                                                            user={
                                                                                this
                                                                                    .state
                                                                                    .user
                                                                            }
                                                                            section={
                                                                                this
                                                                                    .state
                                                                                    .section
                                                                            }
                                                                        />
                                                                    }
                                                                </Popup>
                                                            </Box>
                                                        ) : (
                                                            <Stack
                                                                direction={
                                                                    'row'
                                                                }
                                                            >
                                                                <Box>
                                                                    <Button
                                                                        backgroundColor={
                                                                            '#5581D7'
                                                                        }
                                                                        color={
                                                                            'white'
                                                                        }
                                                                        onClick={
                                                                            this
                                                                                .updateFollowing
                                                                        }
                                                                    >
                                                                        {this
                                                                            .state
                                                                            .following
                                                                            ? 'Unfollow'
                                                                            : 'Follow'}
                                                                    </Button>
                                                                </Box>
                                                                <Box>
                                                                    <Button
                                                                        backgroundColor={
                                                                            '#1D2023'
                                                                        }
                                                                        color={
                                                                            'white'
                                                                        }
                                                                    >
                                                                        DM
                                                                    </Button>
                                                                </Box>
                                                                <Box>
                                                                    <Button
                                                                        backgroundColor={
                                                                            '#CD2E3E'
                                                                        }
                                                                        color={
                                                                            'white'
                                                                        }
                                                                    >
                                                                        Block
                                                                    </Button>
                                                                </Box>
                                                            </Stack>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Center>
                                        </Stack>
                                    </Box>
                                </Center>
                                <this.Userline />
                            </>
                        ) : (
                            <div className="container justify-content-center profile-page-container">
                                <div className="row justify-content-center">
                                    <div
                                        className="col-10"
                                        style={{ padding: '40px' }}
                                    >
                                        <h3
                                            style={{
                                                'font-size': '60px',
                                                'margin-bottom': '20px',
                                            }}
                                        >
                                            User Not Found
                                        </h3>
                                        <p>
                                            The user you were looking for could
                                            not be found.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}
export default Profile
