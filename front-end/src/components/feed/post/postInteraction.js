import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    IconButton,
    Image,
} from '@chakra-ui/react'

import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { FaRegBookmark } from 'react-icons/fa'
import React from 'react'
import { LinkPreview } from '@dhaiwat10/react-link-preview'
import axios from 'axios'
import { RiContactsBookLine } from 'react-icons/ri'
import './post.css'
import { GrAnalytics } from 'react-icons/gr'

const Interaction = ({ liked, disliked, comment }) => {
    if (liked) {
        return <div>liked</div>
    } else if (disliked) {
        return <div>disliked</div>
    } else if (comment) {
        return <div>{comment}</div>
    }
}

export default function PostInteraction({ post, label }) {
    let { liked, disliked, comment } = post

    liked = false
    disliked = false
    comment = 'this is my comment'

    let linkPageBool = true
    if (post.postID == null) {
        if (post[0] != null) {
            post = post[0]
            linkPageBool = false
        } else {
            return (
                <Center pb={5}>
                    <Text>No post found</Text>
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
                    event.preventDefault()
                    if (localStorage.getItem('token') == null) {
                        let url = window.location.href
                        window.location.href =
                            url.substring(0, url.indexOf('/')) + '/signup'
                    } else {
                        let url = window.location.href
                        window.location.href =
                            url.substring(0, url.indexOf('/')) +
                            '/personalPostPage/' +
                            post.postID
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

            <Interaction liked={liked} disliked={disliked} comment={comment} />

            <Stack align={'center'} direction={'column'} spacing={4}>
                <Center>
                    <Heading
                        minW={'30px'}
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (localStorage.getItem('token') == null) {
                                let url = window.location.href
                                window.location.href =
                                    url.substring(0, url.indexOf('/')) +
                                    '/signup'
                            } else if (post.username == 'Anonymous') {
                                // do nothing
                            } else {
                                let url = window.location.href
                                window.location.href =
                                    url.substring(0, url.indexOf('/')) +
                                    '/profile/' +
                                    post.username
                            }
                        }}
                        style={{
                            color: 'darkturquoise',
                            cursor:
                                post.username == 'Anonymous'
                                    ? 'default'
                                    : 'pointer',
                        }}
                        fontSize={'2xl'}
                        fontFamily={'body'}
                    >
                        {post.username == 'Anonymous'
                            ? 'Anonymous'
                            : post.username}
                    </Heading>
                </Center>
                <Text
                    textAlign={'center'}
                    pt={'10px'}
                    className={'color-switch'}
                    color={'gray.100'}
                >
                    {post.postCaption}
                </Text>

                <Center>
                    {post.url !== 'undefined' ? (
                        <Box alignSelf={'center'} px={0} pt={5} w={'100%'}>
                            <Image src={post.url} />
                        </Box>
                    ) : (
                        <></>
                    )}
                </Center>

                <Center>
                    {post.hyperlink !== '' ? (
                        <LinkPreview
                            // margin="30px 0px"
                            width="500px"
                            url={post.hyperlink}
                            backgroundColor="white"
                        />
                    ) : (
                        <></>
                    )}
                </Center>
            </Stack>

            <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                <Box
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        if (localStorage.getItem('token') == null) {
                            let url = window.location.href
                            window.location.href =
                                url.substring(0, url.indexOf('/')) + '/signup'
                        } else {
                            let url = window.location.href
                            window.location.href =
                                url.substring(0, url.indexOf('/')) +
                                '/tag/' +
                                post.tag
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                    px={2}
                    py={1}
                    bg={'#F2AF29'}
                    color={'--mainColor'}
                    rounded={'full'}
                    fontWeight={'300'}
                >
                    {'#' + post.tagID}
                </Box>
            </Stack>
        </Box>
    )
}