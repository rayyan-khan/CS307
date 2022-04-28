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
import { BsAlignBottom, BsTrash } from 'react-icons/bs';
import { RiContactsBookLine } from 'react-icons/ri';
import moment, { utc } from 'moment';

const DirectMessage = (props) => {
    const [username, setUsername] = React.useState('');
    const [conversations, setConversations] = React.useState([]);
    const [profilePic, setProfilePic] = React.useState('');
    const [currentConversation, setCurrentConversation] = React.useState([]);
    const [texts, setTexts] = React.useState([]);
    const [message, setMessage] = React.useState('');
    const [showConversation, setShowConversation] = React.useState(false);
    const [profilePics, setProfilePics] = React.useState([]);
    const [otherUserPic, setOtherUserPic] = React.useState('');
    const [currText, setCurrText] = React.useState('');
    const [talkingToUsername, setTalkingToUsername] = React.useState(props.usernameToTalkWith ? props.usernameToTalkWith : '');
    const [intervalID, setIntervalID] = React.useState(null);
    const [render, setRender] = React.useState(false);

    const onChange = (e) => {

        const value = e.target.value;
        setCurrText(value);
        setMessage(value);
    }

    const handleSubmit = (e) => {
        if (e !== undefined) {
            if (e.key === "Enter") {
                onSend();
            }
        }
    }

    const onSend = () => {
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

            }).then(() => {

                console.log('updating conversations');
                conversations.forEach(conversation => {
                    if (conversation.toUser === talkingToUsername || conversation.fromUser === talkingToUsername) {
                        conversation.message = payload.message;
                        conversation.timeStamp = payload.timeStamp;
                        setRender(!render);

                        console.log('updated')
                    }
                })
            })
            .catch(({ response }) => {
                console.log("got an error");
            })
    }

    const deleteConversation = (usernameToDelete) => {
        const payload = {
            currentUser: username,
            deletedUser: usernameToDelete
        }
        if (intervalID) {
            clearInterval(intervalID);
        }
        console.log("tried to delete convo between " + username + " and " + usernameToDelete); // i dont think talkingtoUsername is right, but not sure how to identify the person you're clicking the trash button for
        axios.post("http://localhost:5000/api/messages/deleteConvo", payload)
            .then((response) => {
                console.log("deleted convo between " + username + " and " + usernameToDelete);
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
        console.log(intervalID);
        if (intervalID) {
            clearInterval(intervalID);
        }
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
                toUser: talkingToUsername,
                time: moment().format('YYYY-MM-DDThh:mm.ssss')
            }
            setConversations([payload, ...conversations])
            axios.post("http://localhost:5000/api/messages/getConversation", payload)
                .then((response) => {
                    console.log(response.data);
                    setCurrentConversation(response.data);
                    setRender(!render);
                    setIntervalID(setInterval(() => {
                        axios.post("http://localhost:5000/api/messages/getConversation", payload)
                            .then((response) => {
                                console.log(response.data);
                                setCurrentConversation(response.data);
                                setRender(!render);
                            })
                            .catch(({ response }) => {
                                console.log("got an error");
                                setCurrentConversation([]);
                            })
                    }, 1000));
                }).catch(({ response }) => {
                    console.log("got an error");
                    setCurrentConversation([]);
                })
        } else if (talkingToUsername) {
            console.log("user found");
            handleGetConversation();
            let intervalID = setInterval(handleGetConversation, 3000);
            setIntervalID(intervalID);
        }
    }, [talkingToUsername])

    const test1 = () => {
        console.log(intervalID);
        if (intervalID) {
            clearInterval(intervalID);
        }
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
                toUser: talkingToUsername,
                time: moment().format('YYYY-MM-DDThh:mm.ssss')
            }
            setConversations([payload, ...conversations])
        } else if (talkingToUsername) {
            console.log("user found");
            handleGetConversation();
            let intervalID = setInterval(handleGetConversation, 3000);
            setIntervalID(intervalID);
        }
    }

    const test = () => {
        let userFound = false;
        for (let i = 0; i < conversations.length; i++) {
            if ((conversations[i].toUser == username ? conversations[i].fromUser : conversations[i].toUser) === talkingToUsername) {
                userFound = true;
            }
        }
        if (talkingToUsername) {
            console.log("trying to get profile pics");
            try {
                let user = talkingToUsername
                axios.get('http://localhost:5000/api/getProfile/' + user).then((res) => {
                    console.log(res.data)
                    setOtherUserPic(res.data.url)
                })
            } catch (error) {
                console.log(error);
            }
            console.log("got profile pics");
        }

        if (!userFound && talkingToUsername !== '') {
            console.log('user not found')
            const payload = {
                fromUser: username,
                toUser: talkingToUsername
            }
            setConversations([payload, ...conversations])
        } else if (talkingToUsername) {
            console.log("user found");
            handleGetConversation();
            let intervalID = setInterval(handleGetConversation, 3000);
            setIntervalID(intervalID);
        }
    }

    useEffect(async () => {
        if (axios.defaults.headers.common['authorization'] != null) {
            console.log('test')
            await axios
                .get('http://localhost:5000/api/getUserFromHeader')
                .then((res) => {
                    console.log(res.data)
                    setUsername(res.data.username);
                    try {
                        axios.get('http://localhost:5000/api/getProfile/' + res.data.username).then((res) => {
                            setProfilePic(res.data.url);
                        })
                    } catch (error) {
                        console.log(error);
                    }
                    try {
                        const payload = {
                            user: res.data.username,
                        }

                        setUsername(res.data.username);

                        axios
                            .post('http://localhost:5000/api/messages/getConversations', payload)
                            .then((res) => {

                                let conversations = [];
                                conversations = res.data;
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
                                    conversations = [payload, ...conversations]
                                }
                                conversations.map((conversation) => {
                                    console.log("trying to get profile pics");
                                    try {
                                        let user = (conversation.toUser == username ? conversation.fromUser : conversation.toUser)
                                        axios.get('http://localhost:5000/api/getProfile/' + user).then((res) => {
                                            conversation.url = res.data.url;
                                            let payload = { user: user, url: res.data.url }
                                            setConversations([...conversations, conversation], test(), test1());
                                            console.log(payload);
                                            setProfilePics(payload)
                                            console.log(profilePics);
                                        })
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    console.log("got profile pics");
                                })
                            })
                    } catch (error) {
                        console.log(error);
                    }

                })
                .then(() => {
                    if (talkingToUsername) {
                        console.log("user found");
                        handleGetConversation();
                        let intervalID = setInterval(handleGetConversation, 3000);
                        setIntervalID(intervalID);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [])

    const handleGetConversation = async () => {
        let username1 = '';
        if (username == '') {
            console.log('getting username');
            await axios.get('http://localhost:5000/api/getUserFromHeader')
                .then((res) => {
                    console.log(res.data)
                    username1 = res.data.username;
                    setUsername(res.data.username);
                })
        }
        console.log(talkingToUsername);
        if (talkingToUsername) {
            console.log('updating');
            try {
                const payload = {
                    user1: username != '' ? username : username1,
                    user2: talkingToUsername,
                }

                await axios
                    .post('http://localhost:5000/api/messages/getHistory', payload)
                    .then((res) => {
                        setCurrentConversation(res.data);
                        console.log(payload);
                        console.log(currentConversation);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleTimeDifference = (time) => {
        if (time != undefined) {
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
        } else {
            return "Now";
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
                                    return (
                                        <CSSTransition key={(conversation.toUser == username ? conversation.fromUser : conversation.toUser)} timeout={700} classNames="conversation">
                                            <Box
                                                mb={8}
                                                ml={6}
                                                backgroundColor={(conversation.toUser == username ? conversation.fromUser : conversation.toUser) == talkingToUsername ? 'darkturquoise' : 'var(--main-color)'}
                                                width={'82%'}
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
                                                <Stack p={8} direction={'row'} alignItems={'center'} position={'relative'}>
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
                                                        <Box>
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
                                                    <Box pos={'absolute'} right={'45px'}>
                                                        <Text
                                                            color={
                                                                'var(--text-color)'
                                                            }
                                                        >
                                                            {handleTimeDifference(conversation.timeStamp)}
                                                        </Text>
                                                    </Box>
                                                    <IconButton
                                                        pos={'absolute'}
                                                        right={'5px'}
                                                        size={'sm'}
                                                        style={{
                                                            color: 'red',
                                                            backgroundColor: 'rgba(0,0,0,0)',
                                                        }}
                                                        _hover={{
                                                            borderColor: 'red',
                                                            borderWidth: '2px',
                                                            transform: 'scale(1.05)',
                                                        }}
                                                        icon={<BsTrash />}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            deleteConversation((conversation.toUser == username ? conversation.fromUser : conversation.toUser))
                                                            conversations.splice(key, 1);
                                                            setConversations([...conversations]);
                                                        }}
                                                    />
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
                {
                    currentConversation ?
                        <>
                            <Box overflowX={'hidden'} overflowY={'scroll'} height={'84vh'} maxHeight={'calc(100vh - 140px)'}>
                                <Stack direction={'column'} spacing={4} p={5}>
                                    {
                                        currentConversation.map((text) => (
                                            text.fromUser == username ?
                                                <Box w="full" position={'relative'} p={8} zIndex={1}>
                                                    <Stack direction={'row'} pos={'absolute'} right={0}>
                                                        <Box mr={5}>
                                                            <div class="from-me">
                                                                <p>{text.message}</p>
                                                            </div>
                                                            <div class="clear"></div>
                                                        </Box>
                                                    </Stack>
                                                </Box> :
                                                <Box w="full" position={'relative'} p={10} zIndex={1}>
                                                    <Stack direction={'row'} pos={'absolute'} left={5}>
                                                        <Box height={'auto'} >
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
                                            onKeyPress={(e) => { handleSubmit(e) }}
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
