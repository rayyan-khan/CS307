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
import { BsAlignBottom } from 'react-icons/bs';


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

    onSend = () => {
        
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
                        <VStack spacing={4}>
                            overflowX={'hidden'}
                            overflowY={'scroll'}
                            {tempTexts.map((text) => (
                                text.side == "right" ?
                                <Box w="full" position={'relative'}>
                                    <Tag size={'lg'} display={'block'} ml={'auto'} height={'auto'} mr={'10'} minW={"10vw"} maxW={'20vw'} key={text} textAlign={'right'} variant='solid' colorScheme='teal'>
                                        {text.text}
                                    </Tag>
                                </Box> : 
                                <Box w="full" position={'relative'}>
                                <Tag size={'lg'} display={'block'} mr={'auto'} height={'auto'} ml={'10'} minW={"10vw"} maxW={'20vw'} key={text} textAlign={'left'} variant='solid' colorScheme='teal'>
                                    {text.text}
                                </Tag>
                            </Box>

                            ))}

                            <Box
                                pt={10}
                                width={'70vw'}
                                overflowX={'hidden'}
                                overflowY={'auto'}
                            >
                                {/* <TransitionGroup component="Tag">
                                    {this.state.texts.map(())}
                                </TransitionGroup> */}
                            </Box>
                        </VStack>
                        <FormControl className='text-box' style={{position: 'absolute', bottom:0, padding:'2rem', left: 0}}>
                            <FormLabel > </FormLabel>
                            <InputGroup pl={'400px'} >
                                <Input
                                // w={'80%'}
                                focusBorderColor='teal.200'
                                placeholder='text'
                                type="text"
                                style={{ color: 'darkturquoise' }} />
                                <InputRightElement width='4.5rem'>
                                    <Button colorScheme='black' bg='darkturquoise' h='1.75rem' size='sm' onClick={this.onSend}> Send
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            
                        </FormControl>

z
                    </Box>
                </GridItem>
            </Grid>
        )
    }
}
export default DirectMessage
