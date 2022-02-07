import { Center, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'

import Post from '../components/feed/post/post';
const axios = require('axios');



function PersonalPostPage(postId) {
    


    const [userPost, setUserPost] = useState("");
    useEffect(() => {
        axios.get("http://localhost:5000/api/getSpecificPost/" + postId).then(res => {
            console.log(res.data);
            setUserPost(res.data);
         }).catch(err => {
             console.log(err);
         })
    }, [])


        return (
            <Post 
               post = {userPost}
               size = {"lrg"}
            />               
        );
}

export default PersonalPostPage;