import {
    Avatar,
    Box,
    Center,
    Text,
    Stack,
} from '@chakra-ui/react';

import React from 'react';
import axios from 'axios';
import "./post.css";


export default function Comment({ comment, index }) {



    return (
        <Box pb={5}>
            <Box
                // backgroundColor={'var(--secondary-color)'}
                width={'30vw'}
                borderBottom={'.5px solid gray'}

            >
                <Stack p={'10px'} direction="row">
                    <Center>
                        <Avatar borderRadius={'full'}
                            src={"https://picsum.photos/800/1500?random=" + index}
                            boxSize='3vw' />
                        <Stack spacing={0} direction={'column'}>
                            <Text align={'left'} pl={'10px'} color={'darkturquoise'} fontSize={'lg'}>
                                {comment.username}
                            </Text>
                            <Text color={'var(--text-color)'} pl={'15px'} align={'left'} fontSize={'md'} width={'19vw'}>
                                {comment.text}
                            </Text>
                        </Stack>
                        <Box width={'100px'} textAlign={'right'}>
                            <Text color={'var(--text-color)'} right={0}>
                                {comment.minsAgo}
                            </Text>
                        </Box>
                    </Center>
                </Stack>
            </Box>
        </Box>
    );
}