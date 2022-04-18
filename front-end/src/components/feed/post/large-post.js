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
    Spinner

} from '@chakra-ui/react';

import { AiOutlineDislike, AiOutlineLike, AiOutlineDelete } from "react-icons/ai"
import { FaRegBookmark } from "react-icons/fa"
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Comment from './comment';
import "./post.css"
import axios from 'axios';
import moment from 'moment';

moment().format();
export default function LargePost({ post }) {
    const [comment, setComment] = React.useState('');

    // toggle state 
    console.log("Post: ", post);
    var disliked = post.isDisliked == "1";
    var liked = post.isLiked == "1";
    const [isLiked, setIsLiked] = React.useState(liked);
    const [loading, setLoading] = React.useState(0);
    console.log(isLiked)
    const [isDisliked, setIsDisliked] = React.useState(disliked);
    const [username, setUsername] = React.useState('');
    const [comments, setComments] = React.useState([]);
    const [updateComments, setUpdateComments] = React.useState(false);
    const [render, setRender] = React.useState(false)
    const [usernamePostID, setUsernamePostID] = React.useState({})

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
        if (post.isLiked === '1') {
            post.isLiked = true
            setIsLiked(true);
            console.log('CHECK ME')
        } else {
            post.isLiked = false
            setIsLiked(false);
            console.log('PRINT PLEASE')
        }

        if (post.isDisliked === '1') {
            post.isDisliked = true
            setIsDisliked(true);
            console.log('Disliked is true at start')
        } else {
            post.isDisliked = false
            setIsDisliked(false);
            console.log('Disliked is False at start')
        }

        setLoading(1);

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
                        try {
                            axios.get("http://localhost:5000/api/comments/" + post.postID).then((res) => {
                                console.log(post);
                                console.log(res.data);
                                setComments(res.data);
                                setLoading(1);
                            });

                        } catch (error) {
                            console.log(error);

                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        setLoading(-1);
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
        if (localStorage.getItem('token') == null) {
            if (event) {
                event.preventDefault()
            }
            let url = window.location.href
            window.location.href =
                url.substring(0, url.indexOf('/')) + '/signup'
        } else {
            if (event) {
                event.stopPropagation()
            }

            usernamePostID['username'] = username
            usernamePostID['postID'] = post.postID
            usernamePostID['table'] = 'UserLike'
            console.log(usernamePostID)


            axios
                .post('http://localhost:5000/api/likeupdate', usernamePostID)
                .then((res) => {
                    console.log(res.data.value)



                    if (res.data.value === 'Added') {
                        console.log('WORKS NOW')

                        post.likesCount += 1
                        setIsLiked(true);
                        post.isLiked = "1"
                        setRender(!render)

                        if (post.isDisliked == "1") {

                            post.dislikeCount -= 1;
                            setIsDisliked(false);
                            post.isDisliked = "0"
                            setRender(!render)
                        }
                    } else {
                        post.likesCount -= 1
                        setIsLiked(false);
                        post.isLiked = "0"
                        setRender(!render)
                        // usernamePostID['change'] = -1
                    }
                    console.log('FIRST HERE')
                    //setAPI(1)
                })
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
        if (localStorage.getItem('token') == null) {
            if (event) {
                event.preventDefault()
            }
            let url = window.location.href
            window.location.href =
                url.substring(0, url.indexOf('/')) + '/signup'
        } else {
            if (event) {
                event.stopPropagation()
            }

            usernamePostID['username'] = username
            usernamePostID['postID'] = post.postID
            usernamePostID['table'] = 'UserDisLike'
            console.log(usernamePostID)

            axios
                .post('http://localhost:5000/api/likeupdate', usernamePostID)
                .then((res) => {
                    console.log(res.data.value)

                    if (res.data.value === 'Added') {
                        console.log('WORKS NOW')

                        post.dislikeCount += 1
                        setIsDisliked(true);
                        post.isDisliked = "1"
                        setRender(!render);

                        if (post.isLiked == "1") {
                            post.likesCount -= 1;
                            setIsLiked(false);
                            post.isLiked = "0"
                            setRender(!render);
                        }
                        //usernamePostID['change'] = 1
                        //usernamePostID['resetTable'] = 'UserLike';
                    } else {
                        post.dislikeCount -= 1
                        setIsDisliked(false);
                        post.isDisliked = "0"
                        setRender(!render);

                        //usernamePostID['change'] = -1
                    }
                    console.log('FIRST HERE')
                })
        }
    }

    const [profilePic, setProfilePic] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    if (localStorage.getItem('token') != null) {
        axios.get("http://localhost:5000/api/getUserFromHeader/").then((res) => {
            console.log("user", res.data);
            setUsername(res.data.username);
            try {
                axios.get("http://localhost:5000/api/getProfile/" + res.data.username).then((res) => {
                    console.log("userprofile", res.data);
                    setProfilePic(res.data.url);
                    setFirstName(res.data.firstName);
                    setLastName(res.data.lastName);
                });
            } catch (error) {
                console.log(error);
            }
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

    function handleCommentWriter() {
        if (window.innerWidth > 1520) {
            return (
                <GridItem pt={10} pb={0} height={'30%'}>
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
                                        src={profilePic}
                                        name={firstName + ' ' + lastName}
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
                                                                console.log("commenting");
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
            )
        } else {
            return (
                <GridItem pos={'relative'} top={0} pr={40} height={'20%'}>
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
                                        src={profilePic}
                                        name={firstName + ' ' + lastName}
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
                                                                console.log("commenting");
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
            )
        }

    }


    if (post.username == null) {
        return (
            <Center className="color-switch" pb={'100vh'}>
                <Center
                    fontSize={'4xl'}
                    color={'var(--text-color)'}
                    pt={'40vh'}
                >
                    <Spinner color="darkturquoise" size="xl" />
                </Center>
            </Center>
        )
    } else if (window.innerWidth > 1250) {
        return (
            <Center>
                <Box pl={'10'} width={'100vw'}>
                    <Grid
                        templateColumns='repeat(2, 1fr)'
                        templateRows='repeat(2, 1fr)'
                        style={{ overflow: 'visible', position: 'relative', }}
                    >
                        <GridItem>
                            <Box
                                flex={1}
                                // minW={'820px'}
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
                                {(post.tagID !== null && post.tagID !== 'null') ?
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
                                                {isBookmarked ? <IconButton mt={'1vh'} ml={'30vw'} size={'lg'} onClick={handleBookmarked} style={{ cursor: 'pointer', backgroundColor: "darkturquoise", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} />
                                                    : <IconButton mt={'3.98vh'} ml={'30vw'} size={'lg'} onClick={handleBookmarked} style={{ backgroundColor: "var(--secondary-color)", color: "black" }} aria-label='Bookmark' icon={<FaRegBookmark />} />}
                                                <IconButton
                                                    size={'lg'}
                                                    top={'3.98vh'}
                                                    left={1}
                                                    onClick={handleDelete}
                                                    style={{
                                                        backgroundColor: 'red',
                                                        color: 'white',
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
                        <GridItem pl={'9vw'}>
                            <Box overflowY={'scroll'}>
                                <Box>
                                    {comments.length > 0 ?
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
                                                                >
                                                                    <Stack height={'75px'} p={'10px'} direction="row">
                                                                        <Center>
                                                                            <Avatar borderRadius={'full'}
                                                                                src={comment.url}
                                                                                name={comment.firstName + ' ' + comment.lastName}
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
                                        : <Box width={'full'} mt={10}>
                                            <Center>
                                                <Box
                                                    mt={10}
                                                    flex={1}
                                                    w={'full'}
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
                                            </Center>
                                        </Box>}
                                </Box>
                            </Box>
                        </GridItem>
                        <GridItem height={0}></GridItem>
                        {handleCommentWriter()}
                    </Grid>
                </Box >
            </Center>
        );
    } else {
        console.log("Width: ", window.innerWidth);
        return (
            <Box>
                <Center>
                    <Grid
                        templateRows='repeat(3, 1fr)'
                        style={{ overflow: 'visible', position: 'relative', }}
                    >
                        <GridItem>
                            <Box
                                minW={'60vw'}
                                // maxW={'full'}
                                className={'color-switch'}
                                w={'full'}
                                // h={'full'}
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
                                {(post.tagID !== null && post.tagID !== 'null') ?
                                    <Stack Stack align={'center'} justify={'center'} direction={'row'} mt={"13%"}>
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
                        <GridItem h={'500px'} w={'full'}>
                            {comments.length > 0 ?
                                <Box w={'full'}>
                                    <Box h={'500px'} pt={10} width={'full'} >
                                        <Box
                                            // mt={375}
                                            flex={1}
                                            w={'full'}
                                            // maxW={'575px'}
                                            className={'color-switch'}
                                            boxShadow={'2xl'}
                                            rounded={'lg'}
                                            p={6}
                                            // maxHeight={'calc(100% - 180px)'}
                                            height={'400px'}
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
                                                                    width={'full'}
                                                                >
                                                                    <Stack height={'75px'} p={'10px'} direction="row">
                                                                        <Center>
                                                                            <Avatar borderRadius={'full'}
                                                                                src={comment.url}
                                                                                name={comment.firstName + ' ' + comment.lastName}
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
                                                                                <Text pos={'absolute'} right={0} color={'var(--text-color)'} width={'100px'}>
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
                                    </Box>
                                </Box>
                                :
                                <Box width={'full'} mt={10} pb={24}>
                                    <Center>
                                        <Box
                                            mt={10}
                                            flex={1}
                                            w={'full'}
                                            // maxW={'575px'}
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
                                    </Center>
                                </Box>
                            }
                            <Box position={'relative'} p={5}>
                                <Box
                                    // minW={'525px'}
                                    // maxW={'400px'}
                                    w={'100%'}
                                    minH={'90px'}
                                    bg={"--mainColor"}
                                    boxShadow={'2xl'}
                                    rounded={'lg'}
                                    p={5}
                                    borderColor={'--secondary-color'}
                                    textAlign={'center'}
                                >
                                    <Stack direction={'row'}>
                                        <Center w={'full'}>
                                            <Avatar
                                                borderRadius={'full'}
                                                src={profilePic}
                                                name={firstName + ' ' + lastName}
                                                blockSize='50px'
                                            />
                                            <Stack direction={'column'} spacing={0} w={'full'}>
                                                <Text
                                                    color={'darkturquoise'}
                                                    align={'left'}
                                                    pl={'10px'}
                                                >
                                                    {username}
                                                </Text>
                                                <Box p={'10px'}>
                                                    <Input
                                                        width={'full'}
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
                                                                        console.log("commenting");
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
                </Center>
            </Box >
        )
    }
}