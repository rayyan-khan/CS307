import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    StackDivider,
    IconButton,
    Image,
} from '@chakra-ui/react'

import {
    AiOutlineDislike,
    AiOutlineLike,
    AiOutlineComment,
} from 'react-icons/ai'
import { ChatIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { FaRegBookmark } from 'react-icons/fa'
import React from 'react'
import { LinkPreview } from '@dhaiwat10/react-link-preview'
import axios from 'axios'
import { RiContactsBookLine } from 'react-icons/ri'
import './post.css'
import { GrAnalytics } from 'react-icons/gr'
import { Divider } from '@chakra-ui/react'

const InteractionIcon = ({ post }) => {
    let { liked, disliked, comment } = post

    return (
        <Stack
            mt={2}
            direction={'row'}
            spacing={4}
            onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
            }}
        >
            <Stack direction={'column'}>
                {liked ? (
                    <IconButton
                        style={{
                            backgroundColor: 'lightgreen',
                            color: 'white',
                        }}
                        icon={<AiOutlineLike />}
                    />
                ) : disliked ? (
                    <IconButton
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                        }}
                        icon={<AiOutlineDislike />}
                    />
                ) : (
                    <Stack direction={'row'}>
                        <IconButton
                            icon={<ChatIcon />}
                            style={{
                                backgroundColor: 'lightblue',
                                color: 'white',
                            }}
                        />
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}

export default function PostInteraction({ post, label }) {
    let linkPageBool = true

    console.log('showing post interaction')
    console.log(post)

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
            <Stack direction={'column'} spacing={'7'}>
                <InteractionIcon post={post} />
                <Stack align={'center'} direction={'row'} spacing={8}>
                    <Heading
                        minW={'30px'}
                        isTruncated
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

                    <Box
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (localStorage.getItem('token') == null) {
                                let url = window.location.href
                                window.location.href =
                                    url.substring(0, url.indexOf('/')) +
                                    '/signup'
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

                    <div className="interaction-post-caption">
                        <Text
                            textAlign={'center'}
                            pt={'10px'}
                            className={'color-switch'}
                            color={'gray'}
                            isTruncated
                        >
                            {post.postCaption}
                        </Text>
                    </div>
                </Stack>
                {post.comment ? (
                    <Stack
                        direction={'column'}
                        divider={
                            <Divider
                                orientation="horizontal"
                                color={'darkgray'}
                            />
                        }
                    >
                        <div />
                        {/* <IconButton
                            style={{
                                backgroundColor: 'white',
                                color: 'gray',
                            }}
                            icon={<ArrowForwardIcon />}
                        /> */}
                        <Text
                            textAlign={'left'}
                            pt={'10px'}
                            className={'color-switch'}
                            color={'darkgray'}
                            isTruncated
                        >
                            {post.comment}
                        </Text>
                    </Stack>
                ) : (
                    <div></div>
                )}
            </Stack>
        </Box>
    )
}
