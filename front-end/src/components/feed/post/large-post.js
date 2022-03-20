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
import React, { useEffect } from 'react';
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Comment from './comment';
import "./post.css"
import axios from 'axios';

const commentsJSON = {
    "comments": [
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        },
        {
            "username": "Junaid",
            "text": "This is a comment",
            "minsAgo": "2 min",
        }
    ]
}



export default function LargePost({ post }) {
    const [comment, setComment] = React.useState('');
    console.log(post);


    // toggle state 
    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [comments, setComments] = React.useState(commentsJSON.comments);
    useEffect(() => {

        var newComment = localStorage.getItem("comment");
        console.log(newComment);
        setComments([JSON.parse(newComment), ...comments]);
    }, []);
    console.log(comments);

    const handleLiked = (event) => {
        event.stopPropagation();
        if (localStorage.getItem('token') == null) {
            event.preventDefault();
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
        } else {

            setIsLiked(!isLiked);
            if (isLiked !== isDisliked) {
                setIsDisliked(false);
            }
        }
    }

    const handleDisliked = (event) => {
        event.stopPropagation();
        if (localStorage.getItem('token') == null) {
            event.preventDefault();
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
        } else {
            setIsDisliked(!isDisliked);
            if (isLiked !== isDisliked) {
                setIsLiked(false);
            }
        }
    }

    if (localStorage.getItem('token') != null) {
        axios.get("http://localhost:5000/api/getUserFromHeader/").then((res) => {
            console.log(res.data);
            setUsername(res.data.username);
        });
    }

    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const handleBookmarked = (event) => {
        event.stopPropagation();
        if (localStorage.getItem('token') == null) {
            event.preventDefault();
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
        } else {
            setIsBookmarked(!isBookmarked);
        }
    }
    let linkPageBool = true;
    if (post.postID == null) {
        console.log(post);
        if (post[0] != null) {
            post = post[0];
            linkPageBool = false;
        } else {
            console.log("post undefined");
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
        <Stack direction={'row'} display={'flex'}>
            <Box
                flex={1}
                minW={'820px'}
                maxW={'820px'}
                className={'color-switch'}
                w={'full'}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}
                textAlign={'center'}
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
                            } else if (post.anonymous == 1) {

                            } else {
                                let url = window.location.href;
                                window.location.href = url.substring(0, url.indexOf("/")) + "/profile/" + post.username;
                            }
                        }} style={{ color: "darkturquoise", cursor: 'pointer' }} fontSize={'5xl'} fontFamily={'body'}>
                            {post.anonymous == 1 ? "Anonymous" : post.username}
                        </Heading>
                    </Center>
                    <Text
                        textAlign={'center'}
                        color={"var(--text-color)"}
                        pt={3}
                        fontSize={'2xl'}
                    >
                        {post.postCaption}
                    </Text>



                    {post.url !== "undefined" ? <Center> <Box
                        pt={5}
                        w={"100%"}
                    >
                        <Image src={post.url} />
                    </Box>  </Center> : <></>}


                    {post.hyperlink !== "" ? <LinkPreview
                        margin="30px auto"
                        width="500px"
                        url={post.hyperlink}
                        backgroundColor='white'
                    /> : <></>}
                </Stack>




                <Stack align={'center'} justify={'center'} direction={'row'} mt={"13%"}>
                    <Box
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (localStorage.getItem('token') == null) {
                                let url = window.location.href;
                                window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                            } else {
                                let url = window.location.href;
                                window.location.href = url.substring(0, url.indexOf("/")) + "/tag/" + post.tag;
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                        px={5}
                        py={2}
                        bg={"#F2AF29"}
                        color={'--mainColor'}
                        rounded={'full'}
                        fontSize={'2xl'}
                        fontWeight={'300'}>
                        {"#" + post.tagID}
                    </Box>
                </Stack>
                <Stack mt={2} direction={'row'} spacing={4}>
                    <Stack direction={'column'}>
                        <Text
                            textAlign={'center'}
                            color={"var(--text-color)"}
                            fontSize={'xl'}
                            fontFamily={'body'}
                        >
                            {post.likesCount}
                        </Text>
                        {isLiked ? <IconButton size={'lg'} onClick={handleLiked} style={{ backgroundColor: "darkturquoise", color: "white" }} aria-label='Like' icon={<AiOutlineLike />} /> : <IconButton style={{ backgroundColor: "var(--secondary-color)", color: "black" }} size={'lg'} onClick={handleLiked} aria-label='Like' icon={<AiOutlineLike />} />}
                    </Stack>
                    <Stack direction={'column'}>
                        <Text
                            textAlign={'center'}
                            color={"var(--text-color)"}
                            fontSize={'xl'}
                            fontFamily={'body'}
                        >
                            {post.dislikeCount}
                        </Text>
                        {isDisliked ? <IconButton size={'lg'} onClick={handleDisliked} style={{ cursor: 'pointer', backgroundColor: "darkturquoise", color: "white" }} aria-label='Dislike' icon={<AiOutlineDislike />} /> : <IconButton size={'lg'} style={{ backgroundColor: "var(--secondary-color)", color: "black" }} onClick={handleDisliked} aria-label='Dislike' icon={<AiOutlineDislike />} />}
                    </Stack>
                    <Stack direction={'column'}>
                        {isBookmarked ? <IconButton size={'lg'} onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "600px", backgroundColor: "darkturquoise", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton size={'lg'} onClick={handleBookmarked} style={{ backgroundColor: "var(--secondary-color)", color: "black", top: "30px", left: "600px" }} aria-label='Bookmark' icon={<FaRegBookmark />} />}
                    </Stack>
                </Stack>
            </Box>
            <Box
                flex={1}
                minW={'550px'}
                maxW={'550px'}
                className={'color-switch'}
                height={'54vh'}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}
                textAlign={'center'}
            >
                <div style={{ backgroundColor: "--mainColor", overflowX: "hidden", overflowY: "scroll", width: "100%", height: '65%' }} >
                    {
                        comments.map((comment, index) => {
                            return (
                                <Box pb={5}>
                                    <Box
                                        // backgroundColor={'var(--secondary-color)'}
                                        width={'30vw'}
                                        borderBottom={'.5px solid gray'}

                                    >
                                        <Stack p={'10px'} direction="row">
                                            <Center>
                                                <Avatar borderRadius={'full'}
                                                    src={"https://picsum.photos/800/1500"}
                                                    boxSize='3vw' />
                                                <Stack spacing={0} direction={'column'}>
                                                    <Text align={'left'} pl={'10px'} color={'darkturquoise'} fontSize={'lg'}>
                                                        {comment.username}
                                                    </Text>
                                                    <Text color={'var(--text-color)'} pl={'15px'} align={'left'} fontSize={'md'} width={'19vw'}>
                                                        {comment.text}
                                                    </Text>
                                                </Stack>
                                                <Box width={'100px'} textAlign={'right'}>
                                                    <Text color={'var(--text-color)'} right={0}>
                                                        {comment.minsAgo}
                                                    </Text>
                                                </Box>
                                            </Center>
                                        </Stack>
                                    </Box>
                                </Box>
                            );
                        })
                    }
                </div>
                <Box pb={5} pt={10}>
                    <Box
                        minW={'500px'}
                        maxW={'400px'}
                        minH={'90px'}
                        bg={"--mainColor"}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        p={5}
                        borderColor={'--secondary-color'}
                        textAlign={'center'}
                    >
                        <Stack direction={'row'}>
                            <Center>
                                <Avatar
                                    src='https://picsum.photos/800/1500'
                                    boxSize='3vw'
                                />
                                <Stack direction={'column'} spacing={0}>
                                    <Text
                                        color={'darkturquoise'}
                                        align={'left'}
                                        pl={'10px'}
                                    >
                                        {username}
                                    </Text>
                                    <Box p={'10px'}>
                                        <Input
                                            width={'160%'}
                                            placeholder='Write a comment'
                                            color={'var(--text-color)'}
                                            value={comment}
                                            onChange={(event) => { setComment(event.target.value) }}
                                            onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    if (localStorage.getItem('token') == null) {
                                                        let url = window.location.href;
                                                        window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                                                    } else {
                                                        setComments([{ text: comment, username: username, minsAgo: "Now" }, ...comments]);
                                                        setComment("");
                                                    }
                                                }
                                            }}
                                            onBlur={(event) => {
                                                if (localStorage.getItem('token') == null) {
                                                    let url = window.location.href;
                                                    window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                                                }
                                            }}
                                        />
                                    </Box>

                                </Stack>
                            </Center>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
}