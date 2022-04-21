import axios from 'axios'
import React, { useEffect, useRef } from 'react'
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
import moment, { utc } from 'moment';

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
    },
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
    },
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

const DirectMessage = (props) => {
    const [username, setUsername] = React.useState('');
    const [conversations, setConversations] = React.useState([]);
    const [profilePic, setProfilePic] = React.useState('');
    const [currentConversation, setCurrentConversation] = React.useState([]);
    const [texts, setTexts] = React.useState([]);
    const [message, setMessage] = React.useState('');
    const [showConversation, setShowConversation] = React.useState(false);
    const [currText, setCurrText] = React.useState('');
    const [talkingToUsername, setTalkingToUsername] = React.useState(props.usernameToTalkWith ? props.usernameToTalkWith : '');

    const onChange = (e) => {
        const value = e.target.value;
        console.log(e.target.value);
        setCurrText(value);
        setMessage(value);
    }

    function handleScroll() {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: 'smooth',
        });
    }

    const onSend = (e) => {
        console.log('why')
        const payload = {
            message: currText,
            fromUser: username,
            toUser: talkingToUsername,
        }
        currentConversation.push(payload);
        axios.post("http://localhost:5000/api/messages/sendMessage", payload)
            .then((response) => {
                const newTemp = {
                    message: currText,
                    fromUser: username,
                    timeStamp: moment().format('YYYY-MM-DDThh:mm.ssss'),
                }
                setMessage('');
                scrollToBottom();

                console.log(currentConversation);
                console.log("got a response");
                console.log(response.data);
            })
            .catch(({ response }) => {
                console.log("got an error");
            })
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom();
    }, [currentConversation])

    useEffect(() => {
        console.log()
        let userFound = false;
        for (let i = 0; i < conversations.length; i++) {
            if ((conversations[i].toUser == username ? conversations[i].fromUser : conversations[i].toUser) === talkingToUsername) {
                userFound = true;
            }
        }
        if (!userFound && talkingToUsername !== '') {
            console.log('user not found')
            const payload = {
                fromUser: username,
                toUser: talkingToUsername
            }
            setConversations([...conversations, payload])
            console.log(conversations);
        } else {
            handleGetConversation();
        }
    }, [talkingToUsername])

    useEffect(() => {
        if (axios.defaults.headers.common['authorization'] != null) {
            console.log('test')
            axios
                .get('http://localhost:5000/api/getUserFromHeader')
                .then((res) => {
                    console.log(res)
                    setUsername(res.data.username);
                    try {
                        axios.get('http://localhost:5000/api/getProfile/' + res.data.username).then((res) => {

                            setProfilePic(res.data.profilePic);
                        })
                    } catch (error) {
                        console.log(error);
                    }
                    try {
                        const payload = {
                            user: res.data.username,
                        }

                        axios
                            .post('http://localhost:5000/api/messages/getConversations', payload)
                            .then((res) => {

                                console.log(res.data);
                                let conversations = [];
                                conversations = res.data;
                                conversations.map((conversation) => {
                                    try {
                                        let user = (conversation.toUser == username ? conversation.fromUser : conversation.toUser)
                                        axios.get('http://localhost:5000/api/getProfile/' + user).then((res) => {

                                            conversation.url = res.data.url;
                                            setConversations([...conversations, conversation])
                                        })
                                    } catch (error) {
                                        console.log(error);
                                    }
                                })
                                setConversations(res.data);
                            })
                    } catch (error) {
                        console.log(error);
                    }

                })
        }
    }, [])

    const handleGetConversation = () => {
        console.log('better')
        if (talkingToUsername) {
            try {
                const payload = {
                    user1: username,
                    user2: talkingToUsername,
                }

                axios
                    .post('http://localhost:5000/api/messages/getHistory', payload)
                    .then((res) => {
                        console.log('lllll')
                        console.log(res.data);
                        console.log('lllll')
                        setCurrentConversation(res.data);
                        setShowConversation(true);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleTimeDifference = (time) => {
        let minsAgo = Math.round(moment.duration(moment.utc().add(4, 'hours').diff(time)).asMinutes());
        if (minsAgo == 0) {
            return "Now";
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
                                        setTalkingToUsername(username);
                                    }}
                                />
                            </div>
                            <TransitionGroup component="Box">
                                {conversations.map((conversation, key) => {
                                    console.log(conversation.profilePic)
                                    return (
                                        <CSSTransition key={(conversation.toUser == username ? conversation.fromUser : conversation.toUser)} timeout={700} classNames="conversation">
                                            <Box
                                                mb={8}
                                                ml={8}
                                                backgroundColor={(conversation.toUser == username ? conversation.fromUser : conversation.toUser) == talkingToUsername ? 'darkturquoise' : 'var(--main-color)'}
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
                                                    setTalkingToUsername((conversation.toUser == username ? conversation.fromUser : conversation.toUser));

                                                }}
                                            >
                                                <Stack p={8} direction={'row'}>
                                                    <Avatar
                                                        name={(conversation.toUser == username ? conversation.fromUser : conversation.toUser)}
                                                        src={conversation.url}
                                                        size="md"
                                                        mr={2}
                                                    />
                                                    <Stack direction={'column'}>
                                                        <Text
                                                            color={(conversation.toUser == username ? conversation.fromUser : conversation.toUser) == talkingToUsername ? 'var(--main-color)' : 'darkturquoise'}
                                                            fontSize={'md'}
                                                        >
                                                            {(conversation.toUser == username ? conversation.fromUser : conversation.toUser)}
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
                                                            {handleTimeDifference(conversation.timeStamp)}
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
                {console.log("-----")}
                {console.log(currentConversation)}
                {console.log('-----')}
                {
                    currentConversation ?
                        <>
                            <Box overflowX={'hidden'} overflowY={'scroll'} height={'84vh'} maxHeight={'calc(100vh - 140px)'}>
                                <Stack direction={'column'} spacing={4} p={5}>
                                    {console.log('-----')}
                                    {console.log(currentConversation)}
                                    {console.log('-----')}
                                    {
                                        currentConversation.map((text) => (
                                            text.fromUser == username ?
                                                <Box w="full" position={'relative'} p={8} zIndex={1}>
                                                    <Stack direction={'row'} pos={'absolute'} right={0}>
                                                        <Box mr={3}>
                                                            <div class="from-me">
                                                                <p>{text.message}</p>
                                                            </div>
                                                            <div class="clear"></div>
                                                        </Box>
                                                        <Avatar
                                                            name={username}
                                                            src={profilePic}
                                                            size="md"
                                                            mr={5}
                                                        />
                                                    </Stack>
                                                </Box> :
                                                <Box w="full" position={'relative'} p={10} zIndex={1}>
                                                    <Stack direction={'row'} pos={'absolute'} left={0}>
                                                        <Avatar
                                                            name={(text.toUser == username ? text.fromUser : text.toUser)}
                                                            src={text.url}
                                                            size="md"
                                                            mr={3}
                                                        />
                                                        <Box height={'auto'}>
                                                            <div class="from-them">
                                                                <p>{text.message}</p>
                                                            </div>
                                                            <div class="clear"></div>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                        ))}
                                    <div ref={messagesEndRef} />
                                </Stack>
                            </Box>
                            <Box height={'20vh'} maxHeight={'80px'} position={'absolute'} bottom={-5} right={0}>
                                <FormControl width={'90vw'} height={'3vh'} className='text-box' position={'absolute'} right={10} zIndex={2}>
                                    <FormLabel > </FormLabel>
                                    <InputGroup pl={'400px'} >
                                        <Input
                                            focusBorderColor='teal.200'
                                            placeholder='Type a message...'
                                            type="text"
                                            value={message}
                                            onChange={(e) => { onChange(e) }}
                                            style={{ color: 'darkturquoise' }} />
                                        <InputRightElement width='4.5rem'>
                                            <Button colorScheme='black' bg='darkturquoise' h='1.75rem' size='sm' onClick={(e) => { onSend(e) }}> Send
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </Box>
                        </>
                        :
                        <Box height={'100vh'}>
                            <Center>
                                <Box p={10} pt={'40vh'}>
                                    <Text fontSize={'3vw'} color={'var(--text-color)'}>
                                        Please select a conversation
                                    </Text>
                                </Box>
                            </Center>
                        </Box>
                }
            </GridItem >
        </Grid >
    )
}
export default DirectMessage
