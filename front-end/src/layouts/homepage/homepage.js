import { Center, requiredChakraThemeKeys, Stack, Spinner, Box } from '@chakra-ui/react';
import React, { useRef } from 'react'

import Post from '../../components/feed/post/post';
import './homepage.css';

const axios = require('axios');

class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {
            allPosts: [],
            loading: 0,
            numberOfPosts: 5,
        }
    }

    componentDidMount() {
        console.log('rendering');
        this.fetchPosts();
    }

    onScroll = (e) => {
        console.log(e.target.clientHeight)
        const bottom = e.target.scrollHeight - e.target.scrollTop - 10 <= e.target.clientHeight;
        console.log(bottom);
        if (bottom) {
            this.setState({ numberOfPosts: this.state.numberOfPosts + 2 });
        }
    };

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
                    if (localStorage.getItem('token') != null && localStorage.getItem('allPosts') != null && posts.length == JSON.parse(localStorage.getItem('allPosts')).length) {
                        console.log('using local storage');
                        this.setState({ allPosts: JSON.parse(localStorage.getItem('allPosts')) });
                        this.setState({ loading: 1 });
                    } else {
                        posts.map(async (post, key) => {
                            post.isLiked = false;
                            post.isDisliked = false;
                            post.isBookmarked = false;
                        });
                        console.log('using server');
                        localStorage.setItem('allPosts', JSON.stringify(posts));
                        this.setState({ allPosts: posts });
                        this.setState({ loading: 1 });
                    }
                })
                .catch(function (error) {
                    // console.log(error);
                    // this.setState({ loading: -1 })
                })
        } catch (error) {
            console.log(error);
        }
        // }
    }


    postHandler() {
        console.log(this.state.allPosts);
        localStorage.setItem('allPosts', JSON.stringify(this.state.allPosts));
        return this.state.allPosts.slice(0, this.state.numberOfPosts).map((post, key) => {
            return (
                <Center pb={5}>
                    <Post
                        label={key}
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
                <Center className='color-switch' pb={'100vh'}>
                    <Center fontSize={'4xl'} color={'white'} pt={'40vh'}>
                        Failed to get posts. Please check your internet and try again
                    </Center>
                </Center>
            );
        } else if (this.state.loading == 0) {
            return (
                <Center className='color-switch' pb={'100vh'}>
                    <Center fontSize={'4xl'} color={'white'} pt={'40vh'}>
                        <Spinner color='darkturquoise' size='xl' />
                    </Center>
                </Center>
            );
        } else if (this.state.loading == 1) {
            return (
                <Box h={'100vh'} className='color-switch'>
                    <div onScroll={this.onScroll} style={{ backgroundColor: "--mainColor", overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                        <Center bg={"--mainColor"} pb={20}>
                            <Stack pt={50}>
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