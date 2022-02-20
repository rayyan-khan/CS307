import { Center, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'

import LargePost from '../components/feed/post/large-post';
import posts from '../components/feed/posts';
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
            axios.get("https://still-sierra-32456.herokuapp.com/api/getSpecificPost/" + this.props.postid)
                .then(res => {
                    this.setState({ post: res.data });
                    console.log(res.data);
                })
        } catch (error) {
            return (
                <Center pb={5}>
                    Error
                </Center>
            )
        }
    }



    render() {
        return (
            <div style={{ backgroundColor: "#151516", overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                <Center bg={"#151516"} pb={200} pt={200}>
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