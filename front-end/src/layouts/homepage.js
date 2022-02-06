import { Center, Stack } from '@chakra-ui/react';
import React from 'react'

import Post from '../components/feed/post/post';
import posts from '../components/feed/posts';



class Homepage extends React.Component {
    postHandler(posts) {
        console.log(posts.posts);
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


    render() {
        return (
            <div style={{ overflowX: "hidden", overflowY: "scroll", width: "100%", height: "100%" }} >
                <Center bg={"#151516"} pb={20}>
                    <Stack>
                        {this.postHandler(posts)}
                    </Stack>
                </Center>
            </div >
        );
    }


}

export default Homepage;