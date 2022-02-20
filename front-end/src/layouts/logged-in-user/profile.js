import axios from 'axios'
import React from 'react'
import '../../styles/profile.css'
import Post from '../../components/feed/post/post'
import posts from '../../components/feed/posts'
import {
    Box, Button, Center, Image, Stack, Text, Input,
    FormControl,
    FormLabel,
} from '@chakra-ui/react'

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
            editMode: true,
        }
    }

    fetchPosts() {

        try {
            axios
                .get(
                    'http://localhost:5000/api/getOrderedPost'
                )
                .then((res) => {
                    console.log(this.state.username)
                    console.log(res.data)
                    const posts = res.data.filter((post) => {
                        return post.username === this.props.username
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

    componentDidMount() {
        this.fetchPosts()

        var sessionUsername = sessionStorage.getItem('username')
        var userViewing = this.props.username
            ? this.props.username
            : sessionUsername
        console.log(userViewing)
        axios
            .get('http://localhost:5000/api/getProfile/' + userViewing)
            .then((res) => {
                console.log(res.data)
                this.setState({
                    username: this.props.username,
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
                        sessionUsername.localeCompare(this.props.username) ===
                        0,
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

    updateProf() {
        //console.log(this.state)
        if (this.state.edit === "edit") {
            this.setState({ edit: "submit" })
        } else {
            this.setState({ edit: "edit" })
            console.log(document.getElementById("bioname").value)
            console.log(document.getElementById("fname").value)
            console.log(document.getElementById("lname").value)
            try {
                //  axios.defaults.headers.common['authorization'] = '$2b$10$7qO4zbtYsg8gRmNrVMgjtu3jd5QejoNTKGQ4gb24QX/Slymkix65e'
                axios.put("http://localhost:5000/api/updateProfile", {
                    //   firstName: document.getElementById("fnama").value,
                    //  lastName: document.getElementById("lname").value,
                    // bio: document.getElementById("bioname").value

                })
            } catch (error) {
                console.log(error);
            }
        }
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
                                            bg={"#151516"}
                                            boxShadow={'2xl'}
                                            rounded={'lg'}
                                            direction={'row'}>
                                            <Center>
                                                <Box>
                                                    <Image
                                                        borderRadius={'full'}
                                                        src="https://picsum.photos/800/1500"
                                                        boxSize='10vw'
                                                    />
                                                </Box>
                                                <Box pl={'1vw'}>
                                                    <Stack direction={'column'} >

                                                        <Box>
                                                            {
                                                                this.state.editMode ? (
                                                                    <>
                                                                        <Stack direction={'row'}>
                                                                            <Text contentEditable={'true'} fontSize={'2xl'} color={'white'} onChange={
                                                                                (e) => {
                                                                                    this.setState({ firstName: e.target.value })
                                                                                }
                                                                            }>
                                                                                {this.state.firstName}
                                                                            </Text>
                                                                            <Text contentEditable={'true'} fontSize={'2xl'} color={'white'} onChange={
                                                                                (e) => {
                                                                                    this.setState({ lastName: e.target.value })
                                                                                }
                                                                            }>
                                                                                {this.state.lastName}
                                                                            </Text>
                                                                        </Stack>
                                                                        <Text pl={'.15vw'} fontWeight={'bold'} color={'white'} fontSize={'xs'}>
                                                                            @{this.state.username}
                                                                        </Text>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Text fontSize={'2xl'} color={'white'}>
                                                                            {this.state.firstName} {this.state.lastName}
                                                                        </Text>
                                                                        <Text pl={'.15vw'} fontWeight={'bold'} color={'white'} fontSize={'xs'}>
                                                                            @{this.state.username}
                                                                        </Text>
                                                                    </>
                                                                )

                                                            }
                                                        </Box>
                                                    </Stack>
                                                    <Stack pt={'1vh'} direction={'row'}>
                                                        <Stack direction={'row'}>
                                                            <Text fontWeight={'bold'} color={'white'}>
                                                                {
                                                                    this.state
                                                                        .numTagsFollowing
                                                                }
                                                            </Text>
                                                            <Text color='white'>
                                                                {' '} Tags
                                                            </Text>
                                                        </Stack>
                                                        <Stack direction={'row'}>
                                                            <Text fontWeight={'bold'} color={'white'}>
                                                                {
                                                                    this.state
                                                                        .numFollowers
                                                                }
                                                            </Text>
                                                            <Text color='white'>
                                                                {' '} Followers
                                                            </Text>
                                                        </Stack>
                                                        <Stack direction={'row'}>
                                                            <Text fontWeight={'bold'} color={'white'}>
                                                                {
                                                                    this.state
                                                                        .numFollowing
                                                                }
                                                            </Text>
                                                            <Text color='white'>
                                                                {' '} Following
                                                            </Text>
                                                        </Stack>
                                                    </Stack>
                                                    <Box pt={'1vh'}>
                                                        <Stack direction={'row'}>
                                                            <Text fontWeight={'bold'} color={'white'}>
                                                                Bio:
                                                            </Text>
                                                            {
                                                                this.state.editMode ? (
                                                                    <>
                                                                        <Text contentEditable={'true'} color='white' onChange={
                                                                            (e) => {
                                                                                this.setState({
                                                                                    bio: e.target.value
                                                                                })
                                                                            }
                                                                        }>
                                                                            {this.state.bio}
                                                                        </Text>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Text color='white'>
                                                                            {this.state.bio}
                                                                        </Text>
                                                                    </>
                                                                )

                                                            }
                                                        </Stack>
                                                    </Box>
                                                    <Box pr={'5px'} pt={'1vh'}>
                                                        {this.state.viewingSelf ? (
                                                            <Box>

                                                                {
                                                                    this.state.editMode ? (
                                                                        <>
                                                                            <Button
                                                                                backgroundColor={'#5581D7'}
                                                                                color={'white'}




                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        editMode: false
                                                                                    })
                                                                                    // TODO: Remove this and get auth header from backend
                                                                                    axios.defaults.headers.common['authorization'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1bmFpZGphdmVkQGljbG91ZC5jb20iLCJ1c2VybmFtZSI6Ikp1bmFpZCIsImlhdCI6MTY0NTMyMzU3NSwiZXhwIjoxNjQ1MzM0Mzc1fQ.ElcL0uSViMVYJ6Lip_UTA9MjsuZ8m29Y8yoLyIeFM6A"
                                                                                    try {
                                                                                        axios.put("http://localhost:5000/api/updateProfile", {
                                                                                            firstName: this.state.firstName,
                                                                                            lastName: this.state.firstName,
                                                                                            bio: this.state.bio,
                                                                                        })
                                                                                    } catch (error) {
                                                                                        console.log(error);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Save Changes
                                                                            </Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Button
                                                                                backgroundColor={'#5581D7'}
                                                                                color={'white'}
                                                                                onClick={() => {
                                                                                    this.setState({
                                                                                        editMode: true
                                                                                    })
                                                                                }}
                                                                            >
                                                                                Edit Profile
                                                                            </Button>
                                                                        </>
                                                                    )

                                                                }
                                                            </Box>
                                                        ) : (
                                                            <Stack direction={'row'}>
                                                                <Box>
                                                                    <Button
                                                                        backgroundColor={'#5581D7'}
                                                                        color={'white'}
                                                                    >
                                                                        Follow/Unfollow
                                                                    </Button>
                                                                </Box>
                                                                <Box>
                                                                    <Button
                                                                        backgroundColor={'#1D2023'}
                                                                        color={'white'}
                                                                    >
                                                                        DM
                                                                    </Button>
                                                                </Box>
                                                                <Box>
                                                                    <Button
                                                                        backgroundColor={'#CD2E3E'}
                                                                        color={'white'}
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

                                        <Stack pt={'7.5vh'} pb={'2.5vh'}>
                                            <Center>
                                                <Box>
                                                    <Text color={'darkturquoise'} fontSize={'4xl'}>
                                                        Posts
                                                    </Text>
                                                </Box>
                                            </Center>
                                        </Stack>
                                    </Box>
                                </Center>
                                <Box style={{ paddingBottom: '80px' }} className="posts-container">
                                    {this.postHandler()}
                                </Box>
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
                        )
                        }
                    </div>
                )
                }
            </div >
        )
    }
}
export default Profile
