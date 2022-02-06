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
    const [isLiked, setIsLiked] = React.useState(false);
    const [isDisliked, setIsDisliked] = React.useState(false);



    const handleLiked = () => {
        setIsLiked(!isLiked);
        if (isLiked !== isDisliked) {
            setIsDisliked(false);
        }
    }

    const handleDisliked = () => {
        setIsDisliked(!isDisliked);
        if (isLiked !== isDisliked) {
            setIsLiked(false);
        }
    }

    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const handleBookmarked = () => setIsBookmarked(!isBookmarked);

    return (
            <Box
                maxW={'620px'}
                w={'full'}
                bg={"#151516"}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}
                textAlign={'center'}>
                <Avatar
                    size={'xl'}
                    src={post.profilePicture}
                    alt={'Avatar Alt'}
                    mb={4}
                    pos={'relative'}
                />
                <Heading onClick={(event) => {
                    event.preventDefault();
                    let url = window.location.href;
                    window.location.href = url.substring(0, url.indexOf("/")) + "/profile/" + post.username;
                }} style={{ color: "#AD343E" }} fontSize={'2xl'} fontFamily={'body'}>
                    {post.username}
                </Heading>
                <Text
                    textAlign={'center'}
                    color={"#DEDDDD"}
                    px={3}>
                    {post.body}
                </Text>
                {post.bodyImage !== "" ? <Box alignSelf={'center'}
                    px={0}
                    pt={10}
                    w={"100%"}
                >
                    <Image src={post.bodyImage} />
                </Box> : <></>}
                {post.bodyURL !== "" ? <LinkPreview
                    margin="30px auto"
                    width="500px"
                    url={post.bodyURL}
                    backgroundColor='white'
                /> : <></>}

                <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                    <Box
                        onClick={(event) => {
                            event.preventDefault();
                            let url = window.location.href;
                            window.location.href = url.substring(0, url.indexOf("/")) + "/tag/" + post.tag;
                        }}
                        px={2}
                        py={1}
                        bg={"#F2AF29"}
                        color={'#151516'}
                        rounded={'full'}
                        fontWeight={'300'}>
                        {"#" + post.tag}
                    </Box>
                </Stack>
                <Text
                    textAlign={'center'}
                    color={"#DEDDDD"}
                    px={2}
                    fontSize={'sm'}
                    fontFamily={'body'}
                    mt={5}
                    w={'17%'}
                >
                    {post.numOfVotes} likes
                </Text>

                <Stack mt={2} direction={'row'} spacing={4}>
                    {isLiked ? <IconButton onClick={handleLiked} style={{ backgroundColor: "#AD343E", color: "white" }} aria-label='Like' icon={<AiOutlineLike />} /> : <IconButton onClick={handleLiked} aria-label='Search database' icon={<AiOutlineLike />} />}
                    {isDisliked ? <IconButton onClick={handleDisliked} style={{ backgroundColor: "#AD343E", color: "white" }} aria-label='Dislike' icon={<AiOutlineDislike />} /> : <IconButton onClick={handleDisliked} aria-label='Search database' icon={<AiOutlineDislike />} />}
                    {isBookmarked ? <IconButton onClick={handleBookmarked} style={{ left: "423px", backgroundColor: "#AD343E", color: "white" }} aria-label='Bookmark' icon={<FaRegBookmark />} /> : <IconButton onClick={handleBookmarked} style={{ left: "423px" }} aria-label='Search database' icon={<FaRegBookmark />} />}
                </Stack>
            </Box>
    );
}