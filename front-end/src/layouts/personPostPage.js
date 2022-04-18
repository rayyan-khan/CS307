import { Center, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'

import LargePost from '../components/feed/post/large-post';
import "./layouts.css";
const axios = require('axios');


class PersonPostPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            post: [],
        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts() {
        console.log("test");
        try {
            axios.get("http://localhost:5000/api/getOrderedPost/")
                .then(res => {
                    console.log('trying to fetch posts');
                    console.log(res.data);
                    const posts = res.data
                    console.log('pots::: ', posts);
                    const post = posts.filter(post => post.postID == this.props.postid);
                    this.setState({ post: post[0] });
                })
        } catch (error) {
            console.log('oh')
            return (
                <Center pb={5}>
                    Error
                </Center>
            )
        }
    }



    render() {
        return (
            <div style={{ overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                <Center backgroundColor={"var(--main-color)"} pb={200} pt={200}>
                    <Stack>
                        <Center>
                            <LargePost
                                post={this.state.post}
                            />
                        </Center>
                    </Stack>
                </Center>
            </div >
        );
    }
}

export default PersonPostPage;