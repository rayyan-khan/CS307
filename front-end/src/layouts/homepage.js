import { Center, requiredChakraThemeKeys, Stack } from '@chakra-ui/react';
import React from 'react'

import Post from '../components/feed/post/post';
import posts from '../components/feed/posts';
import { useEffect, useState } from 'react';

const axios = require('axios');


function postHandler(posts) {
    return posts.posts.map((post) => {
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

function Homepage() {

    useEffect(() => {
        try {
            axios.get("http://localhost:5000/api/getOrderedPost")
                .then(res => {
                    console.log(res.data);
                })
        } catch (error) {
            console.log(error);
        }
    }, []);


    return (
        <div style={{ overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
            <Center bg={"#151516"} pb={20}>
                <Stack>
                    {postHandler(posts)}
                </Stack>
            </Center>
        </div >
    );


}

export default Homepage;