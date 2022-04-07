import axios from 'axios'
import React, { useEffect } from 'react'
import Post from '../../../components/feed/post/post'
import SearchBar from './searchBar'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import {
    Box,
    Button,
    Center,
    Image,
    Stack,
    Text,
    Input,
    IconButton,
    Avatar,
    Tooltip,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import '../../layouts.css'
import './direct-message.css'


const tempConversations = [
    {
        username: 'Misha',
        avatar: 'https://i.imgur.com/qJHvZ9x.png',
        lastMessage: 'Hey, how are you?',
        time: '20m',
    },
    {
        username: 'atharva101',
        avatar: 'https://i.imgur.com/qJHvZ9x.png',
        lastMessage: 'Hey, how are you?',
        time: '1h',
    },
    {
        username: 'Rayyan',
        avatar: 'https://i.imgur.com/qJHvZ9x.png',
        lastMessage: 'Hey, how are you?',
        time: '3h',
    },
    {
        username: 'Max',
        avatar: 'https://i.imgur.com/qJHvZ9x.png',
        lastMessage: 'Hey, how are you?',
        time: '3h',
    },
    {
        username: 'Bhavey',
        avatar: 'https://i.imgur.com/qJHvZ9x.png',
        lastMessage: 'Hey, how are you?',
        time: '3h',
    },
]

class DirectMessage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            conversations: [],
            talkingToUsername: this.props.usernameToTalkWith
                ? this.props.usernameToTalkWith
                : '',
        }
    }

    componentDidUpdate() {
        if (this.state.talkingToUsername) {
            let userFound = false;
            for (let i = 0; i < this.state.conversations.length; i++) {
                if (this.state.conversations[i].username === this.state.talkingToUsername) {
                    userFound = true;
                }
            }
            if (!userFound) {
                console.log('user not found')
                this.setState({
                    conversations: [{
                        username: this.state.talkingToUsername,
                        avatar: 'https://i.imgur.com/qJHvZ9x.png',
                        lastMessage: 'Hey, how are you?',
                        time: '20m',
                    }, ...this.state.conversations]
                })
                console.log(this.state.conversations);
            }
        }
    }


    componentDidMount() {
        if (axios.defaults.headers.common['authorization'] != null) {
            axios
                .get('http://localhost:5000/api/getUserFromHeader')
                .then((res) => {
                    this.setState({ username: res.data.username })
                })
        }
        this.setState({ conversations: tempConversations })
    }

    render() {
        return (
            <Grid templateColumns="repeat(2, 1fr)">
                <GridItem height={'100vh'}>
                    <Box>
                        <Stack
                            borderRightWidth={'2px'}
                            overflowX={'hidden'}
                            overflowY={'scroll'}
                            width={'25vw'}
                            ml={5}
                            direction={'column'}
                            height={'94vh'}
                        >
                            <Box
                                pt={10}
                                width={'27vw'}
                                overflowX={'hidden'}
                                overflowY={'auto'}
                            >
                                <div
                                    style={{
                                        width: '75%',
                                        marginLeft: '8%',
                                        marginBottom: '10%',
                                    }}
                                >
                                    <SearchBar
                                        updateConversation={(username) => {
                                            this.setState({
                                                talkingToUsername: username,
                                            })
                                        }}
                                    />
                                </div>
                                <TransitionGroup component="Box">
                                    {this.state.conversations.map((conversation, key) => {
                                        return (
                                            <CSSTransition key={conversation.username} timeout={700} classNames="conversation">
                                                <Box
                                                    mb={8}
                                                    ml={8}
                                                    backgroundColor={conversation.username == this.state.talkingToUsername ? 'darkturquoise' : 'var(--main-color)'}
                                                    width={'80%'}
                                                    maxWidth={'400px'}
                                                    boxShadow={'xl'}
                                                    rounded={'lg'}
                                                    _hover={{
                                                        boxShadow: '2xl',
                                                        borderColor: 'darkturquoise',
                                                        borderWidth: '2px',
                                                        transform: 'scale(1.05)',
                                                        transition:
                                                            'all 0.2s ease-in-out',
                                                    }}
                                                    onClick={() => {
                                                        this.setState({
                                                            talkingToUsername:
                                                                conversation.username,
                                                        })
                                                    }}
                                                >
                                                    <Stack p={8} direction={'row'}>
                                                        <Avatar
                                                            name={conversation.username}
                                                            src={conversation.avatar}
                                                            size="md"
                                                            mr={2}
                                                        />
                                                        <Stack direction={'column'}>
                                                            <Text
                                                                color={conversation.username == this.state.talkingToUsername ? 'var(--main-color)' : 'darkturquoise'}
                                                                fontSize={'md'}
                                                            >
                                                                {conversation.username}
                                                            </Text>
                                                            <Text
                                                                overflow={'clip'}
                                                                color={
                                                                    'var(--text-color)'
                                                                }
                                                                fontSize={'md'}
                                                            >
                                                                {
                                                                    conversation.lastMessage
                                                                }
                                                            </Text>
                                                        </Stack>
                                                        <Box
                                                            width={'100px'}
                                                            textAlign={'right'}
                                                        >
                                                            <Text
                                                                color={
                                                                    'var(--text-color)'
                                                                }
                                                                right={0}
                                                                pl={6}
                                                                pt={5}
                                                            >
                                                                {conversation.time}
                                                            </Text>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </CSSTransition>
                                        )
                                    })}
                                </TransitionGroup>
                            </Box>
                        </Stack>
                    </Box>
                </GridItem>
                <GridItem>
                    <Box>
                        <Text color={'var(--text-color)'} size={'4xl'}>
                            {this.state.username} wants to talk with{' '}
                            {this.state.talkingToUsername}
                        </Text>
                    </Box>
                </GridItem>
            </Grid>
        )
    }
}
export default DirectMessage
