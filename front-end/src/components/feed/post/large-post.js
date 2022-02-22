import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    IconButton,
    Image,
} from '@chakra-ui/react';

import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"
import { FaRegBookmark } from "react-icons/fa"
import React from 'react';
import { LinkPreview } from "@dhaiwat10/react-link-preview";


export default function LargePost({ post }) {
    console.log(post);

    // toggle state 
    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);



    const handleLiked = (event) => {
        event.stopPropagation();
        if (sessionStorage.getItem('token') == null) {
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
        if (sessionStorage.getItem('token') == null) {
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

    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const handleBookmarked = (event) => {
        event.stopPropagation();
        if (sessionStorage.getItem('token') == null) {
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
        <Box
            minW={'820px'}
            maxW={'820px'}
            minH={'400px'}
            w={'full'}
            bg={"#151516"}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}
            style={linkPageBool ? { cursor: 'pointer' } : {}}
            onClick={(event) => {
                if (linkPageBool) {
                    event.preventDefault();
                    if (sessionStorage.getItem('token') == null) {
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
                        if (sessionStorage.getItem('token') == null) {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
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
                    color={"#DEDDDD"}
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
                        if (sessionStorage.getItem('token') == null) {
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
                    color={'#151516'}
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
                        color={"#DEDDDD"}
                        fontSize={'xl'}
                        fontFamily={'body'}
                    >
                        {post.likesCount}
                    </Text>
                    {isLiked ? <IconButton size={'lg'} onClick={handleLiked} style={{ backgroundColor: "darkturquoise", color: "white" }} aria-label='Like' icon={<AiOutlineLike />} /> : <IconButton size={'lg'} onClick={handleLiked} aria-label='Like' icon={<AiOutlineLike />} />}
                </Stack>
                <Stack direction={'column'}>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        fontSize={'xl'}
                        fontFamily={'body'}
                    >
                        {post.dislikeCount}
                    </Text>
                    {isDisliked ? <IconButton size={'lg'} onClick={handleDisliked} style={{ cursor: 'pointer', backgroundColor: "darkturquoise", color: "white" }} aria-label='Dislike' icon={<AiOutlineDislike />} /> : <IconButton size={'lg'} style={{ cursor: 'pointer' }} onClick={handleDisliked} aria-label='Dislike' icon={<AiOutlineDislike />} />}
                </Stack>
                <Stack direction={'column'}>
                    {isBookmarked ? <IconButton size={'lg'} onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "600px", backgroundColor: "darkturquoise", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton size={'lg'} onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "600px" }} aria-label='Bookmark' icon={<FaRegBookmark />} />}
                </Stack>
            </Stack>
        </Box>
    );
}