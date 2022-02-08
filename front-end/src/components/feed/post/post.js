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


export default function Post({ post }) {
    // toggle state 
    console.log(post);




    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);

    const handleLiked = (event) => {
        event.stopPropagation();
        setIsLiked(!isLiked);
        if (isLiked !== isDisliked) {
            setIsDisliked(false);
        }
    }

    const handleDisliked = (event) => {
        event.stopPropagation();
        setIsDisliked(!isDisliked);
        if (isLiked !== isDisliked) {
            setIsLiked(false);
        }
    }

    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const handleBookmarked = (event) => {
        event.stopPropagation();
        setIsBookmarked(!isBookmarked);
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
        <div style={{ width: "23vw", height: "23vh", position: "relative" }}>
            <Center>
                <Box
                    minW={"620px"}
                    maxW={'620px'}
                    w={'full'}
                    boxShadow={'2xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}
                    style={linkPageBool ? { cursor: 'pointer', width: "23vw", height: "23vh", position: "absolute", top: "0" } : { width: "23vw", height: "23vh", position: "absolute", top: "0" }}
                    onClick={(event) => {
                        if (linkPageBool) {
                            event.preventDefault();
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/personalPostPage/" + post.postID;
                        }
                    }}
                >
                    {/* <Avatar
                    size={'xl'}
                    src={post.profilePicture}
                    alt={'Avatar Alt'}
                    mb={4}
                    pos={'relative'}
                /> */}
                    <Center>
                        <Heading onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/profile/" + post.username;
                        }} style={{ cursor: 'pointer', minW: "100%", color: "#AD343E" }} fontSize={'2xl'} fontFamily={'body'}>
                            {post.username}
                        </Heading>
                    </Center>
                    <Text
                        textAlign={'center'}
                        color={"#DEDDDD"}
                        px={3}>
                        {post.postCaption}
                    </Text>



                    {/* {post.bodyImage !== "" ? <Box alignSelf={'center'}
                        px={0}
                        pt={10}
                        w={"100%"}
                    >
                        <Image src={post.bodyImage} />
                    </Box> : null}


                    {post.bodyURL !== "" ? <LinkPreview
                        margin="30px auto"
                        width="500px"
                        url={post.bodyURL}
                        backgroundColor='white'
                    /> : null} */}



                    <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                        <Box
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                let url = window.location.href;
                                window.location.href = url.substring(0, url.indexOf("/")) + "/tag/" + post.tag;
                            }}
                            px={2}
                            py={1}
                            bg={"#F2AF29"}
                            color={'#151516'}
                            rounded={'full'}
                            style={{ cursor: 'pointer' }}
                            fontWeight={'300'}>
                            {"#" + post.tagID}
                        </Box>
                    </Stack>
                    <Stack align={'center'} direction={'row'} pt={5}>
                        <Text
                            textAlign={'center'}
                            color={"#DEDDDD"}
                            fontSize={'sm'}
                            fontFamily={'body'}
                            w={'10%'}
                            style={{ paddingRight: '18px' }}
                        >
                            {post.likesCount}
                        </Text>
                        <Text
                            textAlign={'center'}
                            color={"#DEDDDD"}
                            fontSize={'sm'}
                            fontFamily={'body'}
                            w={'10%'}
                            style={{ paddingRight: '35px' }}
                        >
                            {post.dislikeCount}
                        </Text>
                    </Stack>

                    <Stack mt={2} direction={'row'} spacing={4}>
                        {isLiked ? <IconButton onClick={handleLiked} style={{ cursor: 'pointer', backgroundColor: "#AD343E", color: "white" }} aria-label='Like' icon={<AiOutlineLike />} /> : <IconButton onClick={handleLiked} aria-label='Search database' icon={<AiOutlineLike />} />}
                        {isDisliked ? <IconButton onClick={handleDisliked} style={{ cursor: 'pointer', backgroundColor: "#AD343E", color: "white" }} aria-label='Dislike' icon={<AiOutlineDislike />} /> : <IconButton onClick={handleDisliked} aria-label='Search database' icon={<AiOutlineDislike />} />}
                        {isBookmarked ? <IconButton onClick={handleBookmarked} style={{ cursor: 'pointer', left: "423px", backgroundColor: "#AD343E", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton onClick={handleBookmarked} style={{ left: "423px" }} aria-label='Search database' icon={<FaRegBookmark />} />}
                    </Stack>
                </Box>
            </Center>
        </div>
    );
}