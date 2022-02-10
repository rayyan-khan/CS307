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
} from '@chakra-ui/react';
import AutoTextArea from '../../../components/autoTextArea.tsx';
import Tags from './tags';

import React, { useEffect, useState } from 'react'

import { GrNext } from "react-icons/gr"
import ImageUpload from 'image-upload-react'
import 'image-upload-react/dist/index.css'
import posts from '../../../components/feed/posts';

const Onboarding = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [imageSrc, setImageSrc] = useState()
    const [currentFrame, setCurrentFrame] = useState(1);

    const handleImageSelect = (event) => {
        setIsDisabled(false);
        setImageSrc(URL.createObjectURL(event.target.files[0]))
    }

    const deleteImage = () => {
        setIsDisabled(true);
        setImageSrc('');
    }

    useEffect(() => {
        console.log(imageSrc);
        if (imageSrc) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
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



    if (currentFrame === 1) {
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
                            <Text fontSize='xl' color={'white'}>Hello there, welcome to Purdue Circle!</Text>
                        </Center>
                        <Center>
                            <Text fontSize='xl' color={'white'}>Let's get your profle setup.</Text>
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
                            <Center>
                                <Button width={'5vw'} onClick={handleSkipButton} fontSize='inherit' color={'black'}>Skip</Button>
                            </Center>
                            <Center position={'relative'} left={'70%'}>
                                <Button width={'5vw'} isDisabled={isDisabled} onClick={handleNextFrame} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
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
                            <Box pt={5} boxShadow={'xl'}>
                                <AutoTextArea />
                            </Box>
                        </Center>

                        <Stack pt={5} direction={"row"}>
                            <Center>
                                <Button width={'5vw'} onClick={handleSkipButton} fontSize='inherit' color={'black'}>Skip</Button>
                            </Center>
                            <Center position={'relative'} left={'70%'}>
                                <Button width={'5vw'} isDisabled={isDisabled} onClick={handleNextFrame} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
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
                            <Center>
                                <Button width={'5vw'} onClick={handleSkipButton} fontSize='inherit' color={'black'}>Skip</Button>
                            </Center>
                            <Center position={'relative'} left={'70%'}>
                                <Button width={'5vw'} isDisabled={isDisabled} onClick={handleNextFrame} rightIcon={<GrNext />} fontSize='inherit' color={'black'}>Next</Button>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Center >
        );
    }
}
export default Onboarding;