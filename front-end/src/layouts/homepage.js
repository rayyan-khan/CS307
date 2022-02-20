import { Center, requiredChakraThemeKeys, Stack, Spinner, Box } from '@chakra-ui/react';
import React, { Suspense } from 'react'

import Post from '../components/feed/post/post';

const axios = require('axios');

class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {
            allPosts: [],
            loading: 0,
        }
    }

    componentDidMount() {
        console.log('rendering');
        this.fetchPosts();
    }

    fetchPosts() {
        // if (localStorage.getItem('allPosts') != null) {
        //     console.log('using local storage');
        //     this.setState({ allPosts: JSON.parse(localStorage.getItem('allPosts')) });
        //     this.setState({ loading: 1 });
        // } else {
        try {
            axios.get("http://localhost:5000/api/getOrderedPost")
                .then(res => {
                    const posts = res.data
                    this.setState({ allPosts: posts });
                    this.setState({ loading: 1 });
                })
                .catch(function (error) {
                    console.log(error);
                    this.setState({ loading: -1 })
                })
        } catch (error) {
            console.log(error);
        }
        // }
    }


    postHandler() {
        console.log(this.state.allPosts);
        localStorage.setItem('allPosts', JSON.stringify(this.state.allPosts));
        return this.state.allPosts.map(post => {
            return (
                <Center pb={5}>
                    <Post
                        label={post.postID}
                        post={post}
                    />
                </Center>
            )
        }
        );
    }



    render() {
        if (this.state.loading == -1) {
            return (
                <Center bg={"#151516"} pb={'100vh'}>
                    <Center fontSize={'4xl'} color={'white'} pt={'40vh'}>
                        Failed to get posts. Please check your internet and try again
                    </Center>
                </Center>
            );
        } else if (this.state.loading == 0) {
            return (
                <Center bg={"#151516"} pb={'100vh'}>
                    <Center fontSize={'4xl'} color={'white'} pt={'40vh'}>
                        <Spinner color='darkturquoise' size='xl' />
                    </Center>
                </Center>
            );
        } else if (this.state.loading == 1) {
            return (
                <Box h={'100vh'} backgroundColor={'#151516'}>
                    <div style={{ backgroundColor: "#151516", overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                        <Center bg={"#151516"} pb={20}>
                            <Stack>
                                {this.postHandler()}
                            </Stack>
                        </Center>
                    </div >
                </Box>
            );
        }
    }
}

export default Homepage;