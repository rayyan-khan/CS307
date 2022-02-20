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

import React, { useEffect, useState } from 'react'

import { GrNext } from "react-icons/gr"
import ImageUpload from 'image-upload-react'
import 'image-upload-react/dist/index.css'
import posts from '../../../components/feed/posts';



class Tags extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tagName: "",
            isClicked: false,
        }
    }

    handleClick = () => {
        this.setState({ isClicked: !this.state.isClicked });
    }

    render() {
        return (
            <Button width={'5vw'} fontSize={'0.65vw'} onClick={this.handleClick} p={5} textColor={this.state.isClicked ? 'white' : 'black'} bg={this.state.isClicked ? 'darkturquoise' : 'white'}>{this.props.tagName}</Button>
        );
    }
}
export default Tags;