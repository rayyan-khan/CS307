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
    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);



    const handleLiked = (event) => {
        event.stopPropagation();
        if (sessionStorage.getItem('username') == null) {
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
        if (sessionStorage.getItem('username') == null) {
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
        if (sessionStorage.getItem('username') == null) {
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
            minW={'620px'}
            maxW={'620px'}
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
                    if (sessionStorage.getItem('username') == null) {
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

            <Center>
                <Heading minW={"30px"} onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (sessionStorage.getItem('username') == null) {
                        let url = window.location.href;
                        window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                    } else {
                        let url = window.location.href;
                        window.location.href = url.substring(0, url.indexOf("/")) + "/profile/" + post.username;
                    }
                }} style={{ color: "#AD343E", cursor: 'pointer' }} fontSize={'2xl'} fontFamily={'body'}>
                    {post.username}
                </Heading>
            </Center>
            <Text
                textAlign={'center'}
                color={"#DEDDDD"}
                px={3}>
                {post.postCaption}
            </Text>


            {/* <Center>
                {post.url !== "" ? <Box alignSelf={'center'}
                    px={0}
                    pt={10}
                    w={"100%"}
                >
                    <Image src={post.url} />
                </Box> : <></>}
            </Center> */}


            {/* 
            {post.bodyURL !== "" ? <LinkPreview
                margin="30px auto"
                width="500px"
                url={post.bodyURL}
                backgroundColor='white'
            /> : <></>} */}




            <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                <Box
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (sessionStorage.getItem('username') == null) {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
                        } else {
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/tag/" + post.tag;
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                    px={2}
                    py={1}
                    bg={"#F2AF29"}
                    color={'#151516'}
                    rounded={'full'}
                    fontWeight={'300'}>
                    {"#" + post.tagID}
                </Box>
            </Stack>
            <Stack mt={2} direction={'row'} spacing={4}>
                <Stack direction={'column'}>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        fontSize={'sm'}
                        fontFamily={'body'}
                    >
                        {post.likesCount}
                    </Text>
                    {isLiked ? <IconButton onClick={handleLiked} style={{ backgroundColor: "#AD343E", color: "white" }} aria-label='Like' icon={<AiOutlineLike />} /> : <IconButton onClick={handleLiked} aria-label='Like' icon={<AiOutlineLike />} />}
                </Stack>
                <Stack direction={'column'}>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        fontSize={'sm'}
                        fontFamily={'body'}
                    >
                        {post.dislikeCount}
                    </Text>
                    {isDisliked ? <IconButton onClick={handleDisliked} style={{ cursor: 'pointer', backgroundColor: "#AD343E", color: "white" }} aria-label='Dislike' icon={<AiOutlineDislike />} /> : <IconButton style={{ cursor: 'pointer' }} onClick={handleDisliked} aria-label='Dislike' icon={<AiOutlineDislike />} />}
                </Stack>
                <Stack direction={'column'}>
                    {isBookmarked ? <IconButton onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "423px", backgroundColor: "#AD343E", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton onClick={handleBookmarked} style={{ cursor: 'pointer', top: "30px", left: "423px" }} aria-label='Bookmark' icon={<FaRegBookmark />} />}
                </Stack>
            </Stack>
        </Box>
    );
}