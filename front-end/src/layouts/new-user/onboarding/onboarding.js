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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'

import { GrNext } from "react-icons/gr"
import ImageUpload from 'image-upload-react'
import 'image-upload-react/dist/index.css'
import posts from '../../../components/feed/posts';

const Onboarding = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [imageSrc, setImageSrc] = useState()

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
        let url = window.location.href;
        window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
    }



    var post = posts.posts[0];
    // #151516
    return (
        <Center h={'full'} overflowY={"hidden"} overflowX={"auto"} bg={"#151516"}>
            <Box
                transform={'translate(-50%, -50%)'}
                position={'fixed'}
                top={'50%'}
                left={'50%'}
                maxW={"820px"}
                w={'55vw'}
                h={'fit-content'}
                bg={"#151516"}
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
                    <Center>
                        <Text fontSize='xl' color={'white'}>Please upload an image to set as your profile picture</Text>
                    </Center>
                    <Center>
                        <Box boxShadow={'xl'}>
                            <ImageUpload
                                handleImageSelect={handleImageSelect}
                                imageSrc={imageSrc}
                                setImageSrc={setImageSrc}
                                style={{
                                    width: 525,
                                    height: 375,
                                    background: '#151516'
                                }}
                            />
                        </Box>
                    </Center>

                    <Stack pt={5} direction={"row"}>
                        <Center>
                            <Button onClick={handleSkipButton} fontSize='xl' color={'black'}>Skip</Button>
                        </Center>
                        <Center pl={600}>
                            <Button isDisabled={isDisabled} rightIcon={<GrNext />} fontSize='xl' color={'black'}>Next</Button>
                        </Center>
                    </Stack>
                </Stack>
            </Box>
        </Center >
    );
}
export default Onboarding;