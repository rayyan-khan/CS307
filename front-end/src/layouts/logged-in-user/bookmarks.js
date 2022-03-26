import {
    Center,
    requiredChakraThemeKeys,
    Stack,
    Spinner,
    Box,
} from '@chakra-ui/react'
import React, { useRef } from 'react'

import Post from '../../components/feed/post/post'
import '../homepage/homepage.css'

const axios = require('axios')

class Bookmarks extends React.Component {
    constructor() {
        super()
        this.state = {
            allPosts: [],
            loading: 0,
        }
    }

    componentDidMount() {
        console.log('rendering')
        this.fetchPosts()
    }

    fetchPosts() {
        try {
            axios
                .get('http://localhost:5000/api/getBookmarks')
                .then((res) => {
                    const posts = res.data
                    posts.map(async (post, key) => {
                        post.isLiked = false
                        post.isDisliked = false
                        post.isBookmarked = false
                    })
                    this.setState({ allPosts: posts })
                    this.setState({ loading: 1 })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ loading: -1 })
                })
        } catch (error) {
            console.log(error)
            this.setState({ loading: -1 })
        }
    }

    bookmarkedPostHandler() {
        console.log(this.state.allPosts)
        localStorage.setItem('allPosts', JSON.stringify(this.state.allPosts))
        return this.state.allPosts.map((post, key) => {
            return (
                <Center pb={5}>
                    <Post label={key} post={post} />
                </Center>
            )
        })
    }

    render() {
        if (this.state.loading == -1) {
            return (
                <Center className="color-switch" pb={'100vh'}>
                    <Center
                        fontSize={'2xl'}
                        color={'var(--text-color)'}
                        pt={'40vh'}
                    >
                        Failed to get posts. Please check your internet and try
                        again
                    </Center>
                </Center>
            )
        } else if (this.state.loading == 0) {
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
        } else if (this.state.loading == 1) {
            return (
                <Box h={'100vh'} className="color-switch">
                    <div
                        onScroll={this.onScroll}
                        style={{
                            backgroundColor: '--mainColor',
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <div>Bookmarked Posts</div>
                        <Center bg={'--mainColor'} pb={20}>
                            <Stack pt={50}>
                                {this.bookmarkedPostHandler()}
                            </Stack>
                        </Center>
                    </div>
                </Box>
            )
        }
    }
}

export default Bookmarks
