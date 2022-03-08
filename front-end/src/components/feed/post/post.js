import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    IconButton,
    Image,
    Input,
} from '@chakra-ui/react';

import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"
import { FaRegBookmark } from "react-icons/fa"
import React from 'react';
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import axios from 'axios';
import { RiContactsBookLine } from 'react-icons/ri';
import "./post.css";
import { GrAnalytics } from 'react-icons/gr';


export default function Post({ post, label }) {

    const [isLiked, setIsLiked] = React.useState(post.isLiked);
    const [isDisliked, setIsDisliked] = React.useState(post.isDisliked);
    const [comment, setComment] = React.useState("");
    const [postComment, setPostComment] = React.useState([]);
    var posts = JSON.parse(localStorage.getItem('allPosts'));
    console.log(label)
    var postIndex = label;



    const handleLiked = (event) => {
        event.stopPropagation();
        setIsLiked(!isLiked);
        if (!isLiked) {
            post.likesCount += 1;
            posts[postIndex].isLiked = true;
            posts[postIndex].likesCount += 1;
            localStorage.removeItem('allPosts');
            localStorage.setItem('allPosts', JSON.stringify(posts));
            if (isLiked !== isDisliked) {
                setIsDisliked(false);
                post.dislikeCount -= 1;
                posts[postIndex].isDisliked = false;
                posts[postIndex].dislikeCount -= 1;
                localStorage.removeItem('allPosts');
                localStorage.setItem('allPosts', JSON.stringify(posts));
            }
        } else {
            post.likesCount -= 1;
            posts[postIndex].isLiked = false;
            posts[postIndex].likesCount -= 1;
            localStorage.removeItem('allPosts');
            localStorage.setItem('allPosts', JSON.stringify(posts));
        }


        if (localStorage.getItem('token') == null) {
            event.preventDefault();
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
        }
    }

    const [username, setUsername] = React.useState("");
    if (localStorage.getItem('token') != null) {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get("http://localhost:5000/api/getUserFromHeader/").then((res) => {
            console.log(res.data);
            setUsername(res.data.username);
        });
    }





    const handleDisliked = (event) => {
        event.stopPropagation();
        setIsDisliked(!isDisliked);
        if (!isDisliked) {
            posts[postIndex].isDisliked = true;
            post.dislikeCount += 1;
            posts[postIndex].dislikeCount += 1;
            localStorage.removeItem('allPosts');
            localStorage.setItem('allPosts', JSON.stringify(posts));

            if (isLiked !== isDisliked) {
                setIsLiked(false);
                post.likesCount -= 1;
                posts[postIndex].isLiked = false;
                posts[postIndex].likesCount -= 1;
                localStorage.removeItem('allPosts');
                localStorage.setItem('allPosts', JSON.stringify(posts));
            }
        } else {
            post.dislikeCount -= 1;
            posts[postIndex].isDisliked = false;
            posts[postIndex].dislikeCount -= 1;
            localStorage.removeItem('allPosts');
            localStorage.setItem('allPosts', JSON.stringify(posts));
        }

        if (localStorage.getItem('token') == null) {
            event.preventDefault();
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
        }
    }

    const [isBookmarked, setIsBookmarked] = React.useState(post.isBookmarked);
    const handleBookmarked = (event) => {
        event.stopPropagation();
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked) {
            posts[postIndex].isBookmarked = true;
        } else {
            posts[postIndex].isBookmarked = false;
        }
        localStorage.removeItem('allPosts');
        localStorage.setItem('allPosts', JSON.stringify(posts));

        if (localStorage.getItem('token') == null) {
            event.preventDefault();
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
        }
    }

    let linkPageBool = true;
    if (post.postID == null) {
        if (post[0] != null) {
            post = post[0];
            linkPageBool = false;
        } else {
            return (
                <Center pb={5}>
                    <Text>
                        No post found
                    </Text>
                </Center>
            )
        }
    }
    return (
        <Box
            minW={'620px'}
            maxW={'620px'}
            w={'full'}
            // bg={"#202124"}
            // border={'1px solid white'}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}
            style={linkPageBool ? { cursor: 'pointer' } : {}}
            onClick={(event) => {
                if (linkPageBool) {
                    event.preventDefault();
                    if (localStorage.getItem('token') == null) {
                        let url = window.location.href;
                        window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                    } else {
                        let url = window.location.href;
                        window.location.href = url.substring(0, url.indexOf("/")) + "/personalPostPage/" + post.postID;
                    }
                }
            }}
        >
            {/* <Avatar
                size={'xl'}
                src={post.profilePicture}
                alt={'Avatar Alt'}
                mb={4}
                pos={'relative'}
                style={linkPageBool ? { cursor: 'pointer' } : {}}
            /> */}
            <Stack align={'center'} direction={'column'} spacing={4}>
                <Center>
                    <Heading minW={"30px"} onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (localStorage.getItem('token') == null) {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                        } else if (post.username == "Anonymous") {
                            // do nothing
                        } else {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/profile/" + post.username;
                        }
                    }} style={{ color: "darkturquoise", cursor: post.username == "Anonymous" ? 'default' : 'pointer' }} fontSize={'2xl'} fontFamily={'body'}>
                        {post.username == "Anonymous" ? "Anonymous" : post.username}
                    </Heading>
                </Center>
                <Text
                    textAlign={'center'}
                    pt={'10px'}
                    className={'color-switch'}
                    color={'var(--text-color)'}
                >
                    {post.postCaption}
                </Text>

                <Center>
                    {post.url !== "undefined" ? <Box alignSelf={'center'}
                        px={0}
                        pt={5}
                        w={"100%"}
                    >
                        <Image src={post.url} />
                    </Box> : <></>}
                </Center>

                <Center>
                    {post.hyperlink !== "" ? <LinkPreview
                        // margin="30px 0px"
                        width="500px"
                        url={post.hyperlink}
                        backgroundColor='white'
                    /> : <></>}
                </Center>
            </Stack>


            <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                <Box
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (localStorage.getItem('token') == null) {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                        } else {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/tag/" + post.tagID;
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                    px={2}
                    py={1}
                    bg={"#F2AF29"}
                    rounded={'full'}
                    fontWeight={'300'}>
                    <Text color={'black'}>
                        {"#" + post.tagID}
                    </Text>
                </Box>
            </Stack>
            <Stack mt={2} direction={'row'} spacing={4}>
                <Stack direction={'column'}>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        fontSize={'sm'}
                        fontFamily={'body'}
                        className={'color-switch'}
                        color={'var(--text-color)'}
                    >
                        {post.likesCount}
                    </Text>
                    {isLiked ? <IconButton onClick={handleLiked} style={{ backgroundColor: "darkturquoise", color: "white" }} icon={<AiOutlineLike />} /> : <IconButton style={{ backgroundColor: "var(--secondary-color)", color: "black" }} onClick={handleLiked} icon={<AiOutlineLike />} />}
                </Stack>
                <Stack direction={'column'}>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        fontSize={'sm'}
                        fontFamily={'body'}
                        className={'color-switch'}
                        color={'var(--text-color)'}
                    >
                        {post.dislikeCount}
                    </Text>
                    {isDisliked ? <IconButton onClick={handleDisliked} style={{ cursor: 'pointer', backgroundColor: "darkturquoise", color: "white" }} icon={<AiOutlineDislike />} /> : <IconButton style={{ backgroundColor: "var(--secondary-color)", color: "black" }} onClick={handleDisliked} icon={<AiOutlineDislike />} />}
                </Stack>
                <Stack width={'30vw'} direction={'column'}>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        fontSize={'sm'}
                        fontFamily={'body'}
                        className={'color-switch'}
                        color={'var(--main-color)'}
                    >
                        {50}
                    </Text>
                    <Center width={'full'}>
                        <Input
                            textAlign={'center'}
                            width={'full'}
                            placeholder='Write a comment'
                            color={'var(--text-color)'}
                            value={comment}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                            onChange={(event) => { setComment(event.target.value) }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if (localStorage.getItem('token') == null) {
                                        let url = window.location.href;
                                        window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                                    } else {
                                        localStorage.setItem('comment', JSON.stringify({ text: comment, username: username, minsAgo: "Now" }));
                                        setComment("");
                                        let url = window.location.href;
                                        window.location.href = url.substring(0, url.indexOf("/")) + "/personalPostPage/" + post.postID;
                                    }
                                }
                            }}
                            onBlur={(event) => {
                                event.stopPropagation();
                                if (localStorage.getItem('token') == null) {
                                    let url = window.location.href;
                                    window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                                }
                            }}
                        />
                    </Center>
                </Stack>
                <Stack direction={'column'}>
                    {isBookmarked ? <IconButton onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", backgroundColor: "darkturquoise", color: "white" }} icon={<FaRegBookmark />} /> : <IconButton onClick={handleBookmarked} style={{ backgroundColor: "var(--secondary-color)", color: "black", top: "30px" }} icon={<FaRegBookmark />} />}
                </Stack>
            </Stack>
        </Box>
    );
}