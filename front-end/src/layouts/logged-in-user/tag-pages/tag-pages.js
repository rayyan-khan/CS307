import { Center, Button, Stack, Spinner, Box, Text, IconButton } from '@chakra-ui/react';
import React, { useRef } from 'react'

import Post from '../../../components/feed/post/post';
import './tag-page.css';

const axios = require('axios');

class TagPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPosts: [],
            loading: 0,
            numberOfPosts: 5,
            tagData: {},
        }
    }

    componentDidMount() {
        console.log('rendering');
        this.fetchPosts();
        this.fetchTagData();
    }

    fetchTagData() {
        try {
            axios.get("http://localhost:5000/api/getTags/")
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].tagID == this.props.tag) {
                            console.log("Test", res.data[i]);
                            this.setState({ tagData: res.data[i] });
                        }
                    }
                })
        } catch (error) {
            console.log(error);
        }
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
        console.log(this.props.tagID);
        localStorage.setItem('allPosts', JSON.stringify(this.state.allPosts));
        return this.state.allPosts.filter((post) => {
            return post.tagID == this.props.tag;
        }).slice(0, this.state.numberOfPosts).map((post, key) => {
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
                <Stack direction={'row'}>
                    <Box pl={100} pt={100} w={'45%'}>
                        <Box
                            minW={'320px'}
                            maxW={'320px'}
                            className='color-switch' maxH={'100vh'}

                            boxShadow={'2xl'}
                            rounded={'lg'}
                            p={6}
                            textAlign={'center'}
                        >
                            <Center>
                                <Stack direction={'column'}>
                                    <Text color={'darkturquoise'} fontWeight={'bold'} textAlign={'center'}>
                                        # {this.props.tag}
                                    </Text>
                                    <Text pl={2} textAlign={'center'} color={'var(--text-color)'}>
                                        Posts: {this.state.allPosts.filter((post) => {
                                            return post.tagID == this.props.tag;
                                        }).length}
                                    </Text>
                                    <Text pl={2} textAlign={'center'} color={'var(--text-color)'}>
                                        Followers: {this.state.tagData.numberOfUsersSubscribed}
                                    </Text>
                                    <Center>
                                        <Button
                                            width={'100px'}
                                            backgroundColor={'#5581D7'}
                                            color={'white'}
                                        >
                                            Follow
                                        </Button>
                                    </Center>
                                </Stack>
                            </Center>
                        </Box>
                    </Box>
                    <Box h={'100vh'} className='color-switch'>
                        <div onScroll={this.onScroll} style={{ backgroundColor: "--mainColor", overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                            <Center bg={"--mainColor"} pb={20}>
                                <Stack pt={50}>
                                    {this.postHandler()}
                                </Stack>
                            </Center>
                        </div >
                    </Box>
                </Stack>
            );
        }
    }
}

export default TagPage;