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
    Grid,
    GridItem,

} from '@chakra-ui/react';

import { AiOutlineDislike, AiOutlineLike, AiOutlineDelete } from "react-icons/ai"
import { FaRegBookmark } from "react-icons/fa"
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Comment from './comment';
import "./post.css"
import axios from 'axios';
import moment from 'moment';

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

moment().format();
export default function LargePost({ post }) {
    const [comment, setComment] = React.useState('');
    console.log(post);


    // toggle state 
    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [comments, setComments] = React.useState(commentsJSON.comments);
    const [updateComments, setUpdateComments] = React.useState(false);
    useEffect(() => {
        try {
            axios.get("http://localhost:5000/api/comments/" + post.postID).then((res) => {
                console.log(post);
                console.log(res.data);
                setComments(res.data);
            });

        } catch (error) {
            console.log(error);

        }
    }, [updateComments]);

    useEffect(() => {
        if (localStorage.getItem('comment') != null) {
            let comment = JSON.parse(localStorage.getItem('comment'));
            console.log(comment);
            console.log(comment.username);
            let jsonObj = {}
            jsonObj['postID'] = comment.postID;
            jsonObj['comment'] = comment.text;
            jsonObj['username'] = comment.username;
            try {
                axios.post("http://localhost:5000/api/createComment", jsonObj)
                    .then(function (response) {
                        console.log(response);
                        setUpdateComments(!updateComments);
                    }
                    )
                    .catch(function (error) {
                        console.log(error);
                    }
                    );
            } catch (error) {

            }
            localStorage.removeItem('comment');
        }
        setUpdateComments(!updateComments);
    }, [post]);
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

    function handleTimeDifference(time) {
        let minsAgo = Math.round(moment.duration(moment.utc().diff(time)).add(4, "hours").asMinutes());
        if (minsAgo == 0) {
            return "Just now";
        }
        if (minsAgo < 60) {
            return minsAgo + "m";
        } else if (minsAgo < 1440) {
            return Math.round(minsAgo / 60) + "h";
        } else if (minsAgo < 10080) {
            return Math.round(minsAgo / 1440) + "d";
        } else if (minsAgo < 43200) {
            return Math.round(minsAgo / 10080) + "w";
        }
        // } else if (minsAgo < 525600) {
        //     return Math.round(minsAgo / 43200) + " month";
        // } else if (minsAgo < 31536000) {
        //     return Math.round(minsAgo / 525600) + " year";
        // }
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

    const handleDelete = (event) => {
        event.preventDefault();
        event.stopPropagation();
        var deleteBody = {
            postID: post.postID,
        }
        try {
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token')
            axios.post("http://localhost:5000/api/deletePost", deleteBody)
                .then(function (response) {
                    let url = window.location.href;
                    window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
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

    function handleComments() {
        console.log("Comments length", comment.length);
        if (comments.length > 0) {
            return (
                <Box
                    flex={1}
                    minW={'575px'}
                    maxW={'575px'}
                    className={'color-switch'}
                    boxShadow={'2xl'}
                    rounded={'lg'}
                    p={6}
                    maxHeight={'50%'}
                    position={'absolute'}
                    textAlign={'center'}
                    overflowY={'scroll'}
                >
                    <div style={{ overflowX: "hidden", overflowY: "scroll", width: "100%", }} >
                        {
                            comments.map((comment, index) => {
                                return (
                                    <Box pb={5}>
                                        <Box
                                            borderBottom={'.5px solid gray'}
                                            width={'30vw'}
                                        >
                                            <Stack height={'75px'} p={'10px'} direction="row">
                                                <Center>
                                                    <Avatar borderRadius={'full'}
                                                        src={"https://picsum.photos/800/1500"}
                                                        blockSize='50px'
                                                    />
                                                    <Stack spacing={0} direction={'column'}>
                                                        <Text align={'left'} pl={'10px'} cursor={'pointer'} color={'darkturquoise'} fontSize={'lg'}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                if (localStorage.getItem('token') == null) {
                                                                    let url = window.location.href;
                                                                    window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                                                                } else {
                                                                    let url = window.location.href;
                                                                    window.location.href = url.substring(0, url.indexOf("/")) + "/profile/" + comment.username;
                                                                }
                                                            }}
                                                        >
                                                            {comment.username}
                                                        </Text>
                                                        <Text color={'var(--text-color)'} pl={'15px'} align={'left'} fontSize={'md'} width={'360px'}>
                                                            {comment.comment}
                                                        </Text>
                                                    </Stack>
                                                </Center>
                                                <Box>
                                                    <Center pt={3}>
                                                        <Text color={'var(--text-color)'} width={'100px'}>
                                                            {
                                                                handleTimeDifference(comment.timeStamp)
                                                            }
                                                        </Text>
                                                    </Center>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>
                                );
                            })
                        }
                    </div>
                </Box>
            );
        } else {
            return (
                <Box
                    flex={1}
                    minW={'575px'}
                    maxW={'575px'}
                    className={'color-switch'}
                    boxShadow={'2xl'}
                    rounded={'lg'}
                    p={6}
                    maxHeight={'calc(100% - 180px)'}
                    position={'absolute'}
                    textAlign={'center'}
                    overflowY={'scroll'}
                >
                    <div height={'5vh'}>
                        <Text pt={2} color={"var(--text-color)"}>
                            No comments
                        </Text>
                    </div>
                </Box>
            );
        }
    }

    return (
        <Box>
            <Grid
                templateColumns='repeat(2, 1fr)'
                templateRows='repeat(2, 1fr)'
                style={{ overflow: 'visible', position: 'relative', }}
            >
                <GridItem>
                    <Box
                        flex={1}
                        minW={'820px'}
                        maxW={'820px'}
                        className={'color-switch'}
                        w={'full'}
                        h={'full'}
                        boxShadow={'2xl'}
                        rounded={'lg'}
                        p={6}
                        textAlign={'center'}
                        position={'relative'}
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
                        {post.tagID !== null ?
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
                            : <></>}
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
                            <Stack direction={'row'}>
                                {post.username === username ? (
                                    <>
                                        {isBookmarked ? <IconButton size={'lg'} onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "550px", backgroundColor: "darkturquoise", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton size={'lg'} onClick={handleBookmarked} style={{ backgroundColor: "var(--secondary-color)", color: "black", top: "30px", left: "550px" }} aria-label='Bookmark' icon={<FaRegBookmark />} />}
                                        <IconButton
                                            size={'lg'}
                                            left={"550px"}
                                            onClick={handleDelete}
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                top: '30px',
                                            }}
                                            icon={<AiOutlineDelete />}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {isBookmarked ? <IconButton size={'lg'} onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "600px", backgroundColor: "darkturquoise", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton size={'lg'} onClick={handleBookmarked} style={{ backgroundColor: "var(--secondary-color)", color: "black", top: "30px", left: "600px" }} aria-label='Bookmark' icon={<FaRegBookmark />} />}
                                    </>
                                )}
                            </Stack>
                        </Stack>
                    </Box>
                </GridItem>
                <GridItem pl={40}>
                    <Box overflowY={'scroll'}>
                        <Box>
                            {handleComments()}
                        </Box>
                    </Box>
                </GridItem>
                <GridItem height={0}></GridItem>
                <GridItem pt={10} height={'30%'}>
                    <Box style={{ paddingLeft: '200px' }} position={'relative'} p={5}>
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
                                        borderRadius={'full'}
                                        src={"https://picsum.photos/800/1500"}
                                        blockSize='50px'
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
                                                autocomplete="off"
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
                                                            console.log(post.postID);
                                                            let jsonObj = {}
                                                            jsonObj['postID'] = post.postID;
                                                            jsonObj['comment'] = comment;
                                                            jsonObj['username'] = username;
                                                            try {
                                                                axios.post("http://localhost:5000/api/createComment", jsonObj)
                                                                    .then(function (response) {
                                                                        console.log(response);
                                                                        setUpdateComments(!updateComments);
                                                                    }
                                                                    )
                                                                    .catch(function (error) {
                                                                        console.log(error);
                                                                    }
                                                                    );
                                                            } catch (error) {

                                                            }
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
                </GridItem>
            </Grid>

        </Box >
    );
}