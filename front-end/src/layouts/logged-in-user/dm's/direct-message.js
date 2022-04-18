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
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    Tag,
    VStack
} from '@chakra-ui/react'
import '../../layouts.css'
import './direct-message.css'
import './direct-message.scss'
import { BsAlignBottom } from 'react-icons/bs';
import { RiContactsBookLine } from 'react-icons/ri';
import moment from 'moment';

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

const tempTexts = [
    {
        side: 'right',
        text: 'Hey Whats Up'
    },
    {
        side: 'left',
        text: 'Not much wbu'
    },
    {
        side: 'right',
        text: 'Im great thanks for asking'
    },
    {
        side: 'left',
        text: 'Me too thats great'
    },
    {
        side: 'left',
        text: 'What are you doing today'
    },
    {
        side: 'right',
        text: 'I am working on my CS252 lab'
    },
    {
        side: 'left',
        text: 'That does not sound like a fun time  '
    }

]

class DirectMessage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            conversations: [],
            texts: [],
            talkingToUsername: this.props.usernameToTalkWith
                ? this.props.usernameToTalkWith
                : '',
        }
    }

    componentDidUpdate() {
        if (this.state.talkingToUsername) {
            let userFound = false;
            for (let i = 0; i < this.state.conversations.length; i++) {
                if ((this.state.conversations[i].toUser == this.state.username ? this.state.conversations[i].fromUser : this.state.conversations[i].toUser) === this.state.talkingToUsername) {
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
                    try {
                        const payload = {
                            user: res.data.username,
                        }
                        axios
                            .post('http://localhost:5000/api/messages/getConversations', payload)
                            .then((res) => {
                                console.log(res.data);
                                this.setState({ conversations: res.data })
                            })
                    } catch (error) {
                        console.log(error);
                    }
                })
        }


    }

    handleTimeDifference(time) {
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
    }


    render() {
        return (
            <Grid templateColumns="repeat(5, 1fr)">
                <GridItem colSpan={1} height={'100vh'} maxW={'500px'} >
                    <Box>
                        <Stack
                            borderRightWidth={'2px'}
                            overflowX={'hidden'}
                            overflowY={'scroll'}
                            width={'25vw'}
                            maxWidth={'500px'}
                            minWidth={'350px'}
                            ml={5}
                            direction={'column'}
                            height={'94vh'}
                        >
                            <Box
                                pt={10}
                                width={'27vw'}
                                maxWidth={'500px'}
                                minWidth={'350px'}
                                overflowX={'hidden'}
                                overflowY={'auto'}
                            >
                                <div
                                    style={{
                                        width: '78%',
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
                                            <CSSTransition key={(conversation.toUser == this.state.username ? conversation.fromUser : conversation.toUser)} timeout={700} classNames="conversation">
                                                <Box
                                                    mb={8}
                                                    ml={8}
                                                    backgroundColor={(conversation.toUser == this.state.username ? conversation.fromUser : conversation.toUser) == this.state.talkingToUsername ? 'darkturquoise' : 'var(--main-color)'}
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
                                                                (conversation.toUser == this.state.username ? conversation.fromUser : conversation.toUser),
                                                        })
                                                    }}
                                                >
                                                    <Stack p={8} direction={'row'}>
                                                        <Avatar
                                                            name={(conversation.toUser == this.state.username ? conversation.fromUser : conversation.toUser)}
                                                            src={conversation.avatar}
                                                            size="md"
                                                            mr={2}
                                                        />
                                                        <Stack direction={'column'}>
                                                            <Text
                                                                color={(conversation.toUser == this.state.username ? conversation.fromUser : conversation.toUser) == this.state.talkingToUsername ? 'var(--main-color)' : 'darkturquoise'}
                                                                fontSize={'md'}
                                                            >
                                                                {(conversation.toUser == this.state.username ? conversation.fromUser : conversation.toUser)}
                                                            </Text>
                                                            <Box width={'10vw'}>
                                                                <Text
                                                                    overflow={'hidden'}
                                                                    textOverflow={'ellipsis'}
                                                                    whiteSpace={'nowrap'}
                                                                    color={
                                                                        'var(--text-color)'
                                                                    }
                                                                    fontSize={'md'}
                                                                >
                                                                    {
                                                                        conversation.message
                                                                    }
                                                                </Text>
                                                            </Box>
                                                        </Stack>
                                                        <Box
                                                            width={'100px'}
                                                            textAlign={'right'}
                                                            display={'block'}
                                                            mr={0}
                                                            ml={"auto"}
                                                        >
                                                            <Text
                                                                color={
                                                                    'var(--text-color)'
                                                                }

                                                                pt={5}
                                                            >
                                                                {this.handleTimeDifference(conversation.timeStamp)}
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
                <GridItem colSpan={4}>
                    <Box>
                        <VStack spacing={4} p={10}>
                            overflowX={'hidden'}
                            overflowY={'scroll'}
                            {tempTexts.map((text) => (
                                text.side == "right" ?
                                    <Box Box w="full" position={'relative'} >
                                        <div class="from-me">
                                            <p>{text.text}</p>
                                        </div>
                                        <div class="clear"></div>
                                    </Box> :
                                    <Box w="full" position={'relative'}>
                                        <div class="from-them">
                                            <p>{text.text}</p>
                                        </div>
                                        <div class="clear"></div>
                                    </Box>

                            ))}


                            <Box
                                pt={10}
                                width={'70vw'}
                                overflowX={'hidden'}
                                overflowY={'auto'}
                            >
                            </Box>
                        </VStack>
                        <FormControl width={'90vw'} className='text-box' position={'absolute'} bottom={10} right={10}>
                            <FormLabel > </FormLabel>
                            <InputGroup pl={'400px'} >
                                <Input
                                    focusBorderColor='teal.200'
                                    placeholder='Type a message...'
                                    type="text"
                                    style={{ color: 'darkturquoise' }} />
                                <InputRightElement width='4.5rem'>
                                    <Button colorScheme='black' bg='darkturquoise' h='1.75rem' size='sm' onClick={this.onSend}> Send
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </Box>
                </GridItem >
            </Grid >
        )
    }
}
export default DirectMessage
