import axios from 'axios'
import React from 'react'
import '../../styles/profile.css'
import Post from '../../components/feed/post/post'
import posts from '../../components/feed/posts'
import {
    Box,
    Button,
    Center,
    Image,
    Stack,
    Text,
    Input,
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
import '../layouts.css'

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            bio: '',
            firstName: '',
            lastName: '',
            numTagsFollowing: 0,
            numFollowing: 0,
            numFollowers: 0,
            viewingSelf: true,
            userExists: true,
            loading: true,
            allPosts: [],
            editMode: false,
            showPosts: true,
        }
    }

    fetchPosts() {
        try {
            axios
                .get('http://localhost:5000/api/getOrderedPost')
                .then((res) => {
                    console.log(this.state.username)
                    console.log(res.data)
                    const posts = res.data.filter((post) => {
                        return post.username === this.state.username
                    })
                    this.setState({ allPosts: posts })
                })
                .catch(function (error) {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }
    }

    postHandler() {
        console.log(this.state.allPosts)
        return this.state.allPosts.map((post, key) => {
            return (
                <Center pb={5}>
                    <Post post={post} />
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
        this.fetchPosts()

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
        await axios
            .get('http://localhost:5000/api/getProfile/' + userViewing)
            .then((res) => {
                console.log(res.data)
                this.setState({
                    username: userViewing,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    bio: res.data.bio,
                    firstName: res.data.firstName ? res.data.firstName : '',
                    lastName: res.data.lastName ? res.data.lastName : '',
                    numTagsFollowing: this.formatNum(6900),
                    numFollowing: this.formatNum(420000),
                    numFollowers: this.formatNum(44444444),
                    // numTagsFollowing: this.formatNum(res.data.numTagsFollowing),
                    // numFollowing: this.formatNum(res.data.numFollowing),
                    // numFollowers: this.formatNum(res.data.numFollowers),
                    viewingSelf:
                        sessionUsername != null &&
                        sessionUsername.localeCompare(userViewing) === 0,
                    loading: false,
                })
            })
            .catch(({ response }) => {
                if (response.data === "User doesn't exist") {
                    this.setState({
                        userExists: false,
                        loading: false,
                    })
                }
            })
    }

    formatNum(num) {
        return Intl.NumberFormat('en', { notation: 'compact' }).format(num)
    }

    toPosts = () => {
        this.setState({ showPosts: true })
    }

    toInteractions = () => {
        this.setState({ showPosts: false })
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
                            Future user interaction content goes here
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
                                                <Box>
                                                    <Image
                                                        borderRadius={'full'}
                                                        src="https://picsum.photos/800/1500"
                                                        boxSize="10vw"
                                                    />
                                                </Box>
                                                <Box pl={'1vw'}>
                                                    <Stack direction={'column'}>
                                                        <Box>
                                                            {this.state
                                                                .editMode ? (
                                                                <>
                                                                    <Stack
                                                                        direction={
                                                                            'row'
                                                                        }
                                                                    >
                                                                        <Input
                                                                            color="var(--text-color)"
                                                                            height={
                                                                                '3.25vh'
                                                                            }
                                                                            width={
                                                                                '8vw'
                                                                            }
                                                                            placeholder="First Name"
                                                                            fontSize={
                                                                                '2l'
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .firstName
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                this.setState(
                                                                                    {
                                                                                        firstName:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }}
                                                                        />
                                                                        <Input
                                                                            color="var(--text-color)"
                                                                            height={
                                                                                '3.25vh'
                                                                            }
                                                                            width={
                                                                                '8vw'
                                                                            }
                                                                            placeholder="Last Name"
                                                                            fontSize={
                                                                                '2l'
                                                                            }
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .lastName
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                this.setState(
                                                                                    {
                                                                                        lastName:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                    <Text
                                                                        pl={
                                                                            '.15vw'
                                                                        }
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
                                                                                .username
                                                                        }
                                                                    </Text>
                                                                </>
                                                            ) : (
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
                                                                                .firstName
                                                                        }{' '}
                                                                        {
                                                                            this
                                                                                .state
                                                                                .lastName
                                                                        }
                                                                    </Text>
                                                                    <Text
                                                                        pl={
                                                                            '.15vw'
                                                                        }
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
                                                                                .username
                                                                        }
                                                                    </Text>
                                                                </>
                                                            )}
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
                                                                                .bio
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.setState(
                                                                                {
                                                                                    bio: e
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
                                                                                '#5581D7'
                                                                            }
                                                                            color={
                                                                                'white'
                                                                            }
                                                                            onClick={() => {
                                                                                axios.defaults.headers.common[
                                                                                    'authorization'
                                                                                ] =
                                                                                    localStorage.getItem(
                                                                                        'token'
                                                                                    )
                                                                                console.log(
                                                                                    this
                                                                                        .state
                                                                                        .firstName
                                                                                )
                                                                                console.log(
                                                                                    this
                                                                                        .state
                                                                                        .lastName
                                                                                )
                                                                                console.log(
                                                                                    this
                                                                                        .state
                                                                                        .bio
                                                                                )
                                                                                try {
                                                                                    axios.put(
                                                                                        'http://localhost:5000/api/updateProfile',
                                                                                        {
                                                                                            firstName:
                                                                                                this
                                                                                                    .state
                                                                                                    .firstName,
                                                                                            lastName:
                                                                                                this
                                                                                                    .state
                                                                                                    .lastName,
                                                                                            bio: this
                                                                                                .state
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
                                                                                    }
                                                                                )
                                                                            }}
                                                                        >
                                                                            Edit
                                                                            Profile
                                                                        </Button>
                                                                    </>
                                                                )}
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
                                                                    >
                                                                        Follow/Unfollow
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
