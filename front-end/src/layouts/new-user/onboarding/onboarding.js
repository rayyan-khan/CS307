import {
    Box,
    Center,
    Text,
    Stack,
    Button,
    Input,
    FormControl,
    FormLabel,
    color,
} from '@chakra-ui/react';
import AutoTextArea from '../../../components/autoTextArea.tsx';
import Tags from './tags';

import React, { useEffect, useState } from 'react'

import { GrNext } from "react-icons/gr"
import ImageUpload from 'image-upload-react'
import 'image-upload-react/dist/index.css'
import "../../layouts.css";

import axios from 'axios';

const Onboarding = () => {
    const [nameNextDisabled, setNameNextDisabled] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [imageNextDisabled, setImageNextDisabled] = useState(true);
    const [imageSrc, setImageSrc] = useState();

    const [bio, setBio] = useState('');

    const [currentFrame, setCurrentFrame] = useState(3);

    // TODO: Remove this and get auth header from backend


    const handleNameSubmit = (event) => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        try {
            axios.put("http://localhost:5000/api/updateProfile", {
                firstName: firstName,
                lastName: lastName,
            })
        } catch (error) {
            console.log(error);
        }


        console.log(firstName + ' ' + lastName)
        setCurrentFrame(1);
    }

    const handleImageSelect = (event) => {
        setImageNextDisabled(false);
        setImageSrc(URL.createObjectURL(event.target.files[0]))
    }

    const handleImageSubmit = (event) => {
        // TODO: Sent axios PUT request to update image
        setCurrentFrame(2);
    }

    const handleBioSubmit = (event) => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        try {
            axios.put("http://localhost:5000/api/updateProfile", {
                bio: bio,
            })
        } catch (error) {
            console.log(error);
        }
        setCurrentFrame(3);
    }

    const handleTagsSubmit = (event) => {
        // TODO: Sent axios PUT request to update tags
        localStorage.setItem('username', 'Guest');
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";

    }




    useEffect(() => {
        console.log(imageSrc);
        if (imageSrc) {
            setImageNextDisabled(false);
        } else {
            setImageNextDisabled(true);
        }
    }, [imageSrc])


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
            <Center h={'100vh'} overflowY={"hidden"} overflowX={"auto"} bg={"--mainColor"}>
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
                            <Text fontSize='xl' color={'var(--text-color)'}>Hello there, welcome to Purdue Circle!</Text>
                        </Center>
                        <Center>
                            <Text fontSize='lg' color={'var(--text-color)'}>Let's get to know you a little bit more</Text>
                        </Center>
                        <Center pt={5}>
                            <Text fontSize='md' color={'var(--text-color)'}>What's your full name?</Text>
                        </Center>
                        <Center>
                            <Stack>
                                <FormControl>
                                    <FormLabel color={'var(--text-color)'} htmlFor='email'>First Name</FormLabel>
                                    <Input focusBorderColor='darkturquoise' value={firstName} color={'var(--text-color)'} id='email' type='name' onChange={(e) => {
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
                                    <FormLabel color={'var(--text-color)'} htmlFor='email'>Last Name</FormLabel>
                                    <Input focusBorderColor='darkturquoise' value={lastName} color={'var(--text-color)'} id='email' type='name' onChange={(e) => {
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
                                <Button backgroundColor={'var(--secondary-color)'} width={'4vw'} isDisabled={nameNextDisabled} onClick={handleNameSubmit} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>
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
            <Center h={'100vh'} overflowY={"hidden"} overflowX={"auto"} bg={"--mainColor"}>
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
                            <Text fontSize='xl' color={'var(--text-color)'}>{"Nice to meet you " + firstName}</Text>
                        </Center>
                        <Center pt={5}>
                            <Text fontSize='xl' color={'var(--text-color)'}>Please upload an image to set as your profile picture.</Text>
                        </Center>
                        <Center>
                            <Box>
                                <ImageUpload
                                    handleImageSelect={handleImageSelect}
                                    imageSrc={imageSrc}
                                    setImageSrc={setImageSrc}
                                    style={{
                                        width: "25.5vw",
                                        height: "18.225vw",
                                        background: 'var(--tertiary-color)',
                                    }}
                                />
                            </Box>
                        </Center>

                        <Stack pt={5} direction={"row"}>
                            <Center position={'relative'} left={'86%'}>
                                <Button backgroundColor={'var(--secondary-color)'} width={'4vw'} isDisabled={imageNextDisabled} onClick={handleImageSubmit} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );
    } else if (currentFrame === 2) {
        return (
            <Center h={'100vh'} overflowY={"hidden"} overflowX={"auto"} bg={"--mainColor"}>
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
                            <Text fontSize='xl' color={'var(--text-color)'}>Great! Now let's get your bio setup.</Text>
                        </Center>
                        <Center>
                            <Text fontSize='sm' color={'var(--text-color)'}>Don't worry, you can always change it later.</Text>
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
                                <Button backgroundColor={'var(--secondary-color)'} width={'4vw'} onClick={handleBioSubmit} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );

    } else if (currentFrame === 3) {
        return (
            <Center h={'100vh'} overflowY={"hidden"} overflowX={"auto"} bg={"--mainColor"}>
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
                            <Text fontSize='xl' color={'var(--text-color)'}>Last Step! Would you like to follow any of these tags?</Text>
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
                                <Button backgroundColor={'var(--secondary-color)'} width={'4vw'} onClick={handleTagsSubmit} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );
    }
}
export default Onboarding;