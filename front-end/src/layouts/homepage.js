import { Center, requiredChakraThemeKeys, Stack } from '@chakra-ui/react';
import React from 'react'

import Post from '../components/feed/post/post';
import { useEffect, useState } from 'react';

const axios = require('axios');

class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {
            allPosts: [],
        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts() {
        try {
            axios.get("http://localhost:5000/api/getOrderedPost")
                .then(res => {
                    const posts = res.data
                    this.setState({ allPosts: posts });
                })
        } catch (error) {
            return (
                <Center pb={5}>
                    Error
                </Center>
            )
        }
    }


    postHandler() {
        console.log(this.state.allPosts);
        return this.state.allPosts.map((post, key) => {
            return (
                <Center pb={5}>
                    <Post
                        post={post}
                    />
                </Center>
            )
        }
        );
    }



    render() {
        return (
            <div style={{ backgroundColor: "#151516", overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                <Center bg={"#151516"} pb={20}>
                    <Stack>
                        {this.postHandler()}
                    </Stack>
                </Center>
            </div >
        );
    }
}

export default Homepage;