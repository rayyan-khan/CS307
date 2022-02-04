import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Badge,
    IconButton,
    Image,
} from '@chakra-ui/react';
import React from 'react'

import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai"
import { FaRegBookmark } from "react-icons/fa"
import { LinkPreview } from "@dhaiwat10/react-link-preview";


import logo from '../../logo.png';
import posts from '../../components/feed/posts';


class Onboarding extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            bio: '',
            numTagsFollowing: 0,
            numFollowing: 0,
            numFollowers: 0,
            viewingSelf: true
        }
    }



    render() {

        var post = posts.posts[0];
        // #151516
        return (
            <Center overflow={"hidden"} style={{ paddingBottom: "51%" }} bg={"#151516"} pt={10}>
                <Box
                    maxW={'620px'}
                    w={'full'}
                    bg={"#151516"}
                    boxShadow={'2xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}>
                    <Stack position={"relative"} direction={"row"}>
                        <Avatar
                            size={'xl'}
                            src={post.profilePicture}
                            alt={'Avatar Alt'}
                            mb={4}
                            pos={'relative'}
                        />
                        <Text
                            pt={4}
                            pl={6}
                            pos={'relative'}
                            color={"#DDDEDD"}
                            fontSize={'2xl'}>
                            <Stack direction={"column"}>
                                <Text>
                                    <b>0</b>
                                </Text>
                                <Text>
                                    Tags
                                </Text>
                            </Stack>
                        </Text>
                        <Text
                            pt={4}
                            pl={6}
                            pos={'relative'}
                            color={"#DDDEDD"}
                            fontSize={'2xl'}>
                            <Stack direction={"column"}>
                                <Text>
                                    <b>0</b>
                                </Text>
                                <Text>
                                    Followers
                                </Text>
                            </Stack>
                        </Text>
                        <Text
                            pt={4}
                            pl={6}
                            pos={'relative'}
                            color={"#DDDEDD"}
                            fontSize={'2xl'}>
                            <Stack direction={"column"}>
                                <Text>
                                    <b>0</b>
                                </Text>
                                <Text>
                                    Followings
                                </Text>
                            </Stack>
                        </Text>
                    </Stack>
                    <Stack direction={"row"}>
                        <Text
                            align={"left"}
                            pl={32}
                            pos={'relative'}
                            color={"#DDDEDD"}
                            fontSize={'2xl'}>
                            Bio:
                        </Text>
                        <Text
                            pt={0.5}
                            align={"left"}
                            pos={'relative'}
                            color={"gray"}
                            fontSize={'2xl'}>
                            Nothing to see here.
                        </Text>
                    </Stack>
                </Box>
            </Center >

        );
    }
}
export default Onboarding;