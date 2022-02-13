import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    IconButton,
    Image,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Field,
    Formik
} from '@chakra-ui/react';
import AutoTextArea from '../../../components/autoTextArea.tsx';
import Tags from './tags';

import React, { useEffect, useState } from 'react'

import { GrNext } from "react-icons/gr"
import ImageUpload from 'image-upload-react'
import 'image-upload-react/dist/index.css'
import posts from '../../../components/feed/posts';

const Onboarding = () => {
    const [imageNextDisabled, setImageNextDisabled] = useState(true);
    const [nameNextDisabled, setNameNextDisabled] = useState(true);

    const [imageSrc, setImageSrc] = useState()
    const [currentFrame, setCurrentFrame] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [tags, setTags] = useState([]);

    const handleImageSelect = (event) => {
        setImageNextDisabled(false);
        setImageSrc(URL.createObjectURL(event.target.files[0]))
    }

    const handleNameSubmit = (event) => {
        console.log(firstName + ' ' + lastName)
        setCurrentFrame(1);
    }

    useEffect(() => {
        console.log(imageSrc);
        if (imageSrc) {
            setImageNextDisabled(false);
        } else {
            setImageNextDisabled(true);
        }
    }, [imageSrc])

    const handleSkipButton = (event) => {
        event.preventDefault();
        sessionStorage.setItem('username', 'Guest');
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
    }

    const handleNextFrame = () => {
        if (currentFrame === 3) {
            sessionStorage.setItem('username', 'Guest');
            let url = window.location.href;
            window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
        }
        setCurrentFrame(currentFrame + 1);
    }

    const handleNameChange = (event) => {
        console.log(event.target.value);
    }



    let tagsFirstRow = [
        {
            name: '#brilliance',
        },
        {
            name: '#breeze',
        },
        {
            name: '#palace',
        },
        {
            name: '#prospect',
        },
    ];

    let tagsSecondRow = [
        {
            name: '#tradition',
        },
        {
            name: '#skate',
        },
        {
            name: '#article',
        },
        {
            name: '#provision',
        },
    ];

    let tagsThirdRow = [
        {
            name: '#spirit',
        },
        {
            name: '#parachute',
        },
        {
            name: '#corner',
        },
        {
            name: '#notion',
        },
    ];



    function updateName(value) {
        console.log(value);
    }


    if (currentFrame === 0) {
        return (
            <Center h={'full'} overflowY={"hidden"} overflowX={"auto"} bg={"#151516"}>
                <Box
                    position={'relative'}
                    maxW={"820px"}
                    w={'37vw'}
                    boxShadow={'xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}>
                    <Stack>
                        <Center>
                            <Text fontSize='xl' color={'white'}>Hello there, welcome to Purdue Circle!</Text>
                        </Center>
                        <Center>
                            <Text fontSize='lg' color={'white'}>Let's get to know you a little bit more</Text>
                        </Center>
                        <Center pt={5}>
                            <Text fontSize='md' color={'white'}>What's your full name?</Text>
                        </Center>
                        <Center>
                            <Stack>
                                <FormControl>
                                    <FormLabel color={'white'} htmlFor='email'>First Name</FormLabel>
                                    <Input focusBorderColor='#AD343E' value={firstName} color={'white'} id='email' type='name' onChange={(e) => {
                                        if (!(e.currentTarget.value.length > 30)) {
                                            setFirstName(e.currentTarget.value)
                                        }
                                        if (firstName && lastName) {
                                            setNameNextDisabled(false);
                                        } else {
                                            setNameNextDisabled(true);
                                        }
                                    }} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel color={'white'} htmlFor='email'>Last Name</FormLabel>
                                    <Input focusBorderColor='#AD343E' value={lastName} color={'white'} id='email' type='name' onChange={(e) => {
                                        if (!(e.currentTarget.value.length > 30)) {
                                            setLastName(e.currentTarget.value)
                                        }
                                        if (firstName && lastName) {
                                            setNameNextDisabled(false);
                                        } else {
                                            setNameNextDisabled(true);
                                        }
                                    }} />
                                </FormControl>
                            </Stack>
                        </Center>
                        <Stack pt={5} direction={"row"}>
                            <Center position={'relative'} left={'86%'}>
                                <Button width={'5vw'} isDisabled={nameNextDisabled} onClick={handleNameSubmit} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>
                                    Next
                                </Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );
    }
    if (currentFrame === 1) {
        return (
            <Center h={'full'} overflowY={"hidden"} overflowX={"auto"} bg={"#151516"}>
                <Box
                    position={'relative'}
                    maxW={"820px"}
                    w={'37vw'}

                    boxShadow={'xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}>
                    <Stack>
                        <Center>
                            <Text fontSize='xl' color={'white'}>{"Nice to meet you " + firstName}</Text>
                        </Center>
                        <Center pt={5}>
                            <Text fontSize='xl' color={'white'}>Please upload an image to set as your profile picture.</Text>
                        </Center>
                        <Center>
                            <Box boxShadow={'xl'}>
                                <ImageUpload
                                    handleImageSelect={handleImageSelect}
                                    imageSrc={imageSrc}
                                    setImageSrc={setImageSrc}
                                    style={{
                                        width: "34vw",
                                        height: "24.3vw",
                                        background: '#151516'
                                    }}
                                />
                            </Box>
                        </Center>

                        <Stack pt={5} direction={"row"}>
                            <Center position={'relative'} left={'86%'}>
                                <Button width={'5vw'} isDisabled={imageNextDisabled} onClick={handleNextFrame} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );
    } else if (currentFrame === 2) {
        return (
            <Center h={'full'} overflowY={"hidden"} overflowX={"auto"} bg={"#151516"}>
                <Box
                    position={'relative'}
                    maxW={"820px"}
                    w={'37vw'}
                    h={'fit-content'}
                    boxShadow={'xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}>
                    <Stack>
                        <Center>
                            <Text fontSize='xl' color={'white'}>Great! Now let's get your bio setup.</Text>
                        </Center>
                        <Center>
                            <Text fontSize='sm' color={'white'}>Don't worry, you can always change it later.</Text>
                        </Center>
                        <Center>
                            <Box pt={5} boxShadow={'xl'}>
                                <AutoTextArea value={bio} onChange={(e) => {
                                    if (!(e.currentTarget.value.length > 200)) {
                                        setBio(e.currentTarget.value)
                                    }
                                }} />
                            </Box>
                        </Center>

                        <Stack pt={5} direction={"row"}>
                            <Center position={'relative'} left={'86%'}>
                                <Button width={'5vw'} onClick={handleNextFrame} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );

    } else if (currentFrame === 3) {
        return (
            <Center h={'full'} overflowY={"hidden"} overflowX={"auto"} bg={"#151516"}>
                <Box
                    position={'relative'}
                    maxW={"820px"}
                    w={'37vw'}
                    h={'fit-content'}
                    boxShadow={'xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}>
                    <Stack>
                        <Center>
                            <Text fontSize='xl' color={'white'}>Last Step! Would you like to follow any of these tags?</Text>
                        </Center>
                        <Center pt={10}>
                            <Stack direction={'column'} p={3}>
                                <Stack p={3} direction={"row"}>
                                    {
                                        tagsFirstRow.map((tag, index) => {
                                            return (
                                                <Tags tagName={tag.name} key={index} />
                                            )
                                        })
                                    }

                                </Stack>
                                <Stack p={3} direction={"row"}>
                                    {
                                        tagsSecondRow.map((tag, index) => {
                                            return (
                                                <Tags tagName={tag.name} key={index} />
                                            )
                                        })
                                    }
                                </Stack>
                                <Stack p={3} direction={"row"}>
                                    {
                                        tagsThirdRow.map((tag, index) => {
                                            return (
                                                <Tags tagName={tag.name} key={index} />
                                            )
                                        })
                                    }
                                </Stack>

                            </Stack>
                        </Center>

                        <Stack pt={5} direction={"row"}>
                            <Center position={'relative'} left={'86%'}>
                                <Button width={'5vw'} isDisabled={imageNextDisabled} onClick={handleNextFrame} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );
    }
}
export default Onboarding;