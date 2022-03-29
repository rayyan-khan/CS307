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
import "../../layouts.css";
import axios from 'axios';


class Tags extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tagName: "",
            isClicked: false,
        }
    }

    handleClick = () => {
        if (this.state.isClicked) {
            try {
                let jsonObj = {}
                jsonObj['tagID'] = this.props.tagName;
                axios.defaults.headers.common['authorization'] = localStorage.getItem('token')
                axios.post("http://localhost:5000/api/unfollowTag", jsonObj).then((response) => {
                    console.log(response);
                })
            } catch (error) {
                console.log(error);
            }
            this.setState({
                isClicked: false,
            })
        } else {
            this.setState({
                isClicked: true,
            });
            try {
                let jsonObj = {}
                jsonObj['tagID'] = this.props.tagName;
                axios.defaults.headers.common['authorization'] = localStorage.getItem('token')
                axios.post("http://localhost:5000/api/followTag", jsonObj).then((response) => {
                    console.log(response);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    render() {
        return (
            <Button width={'5vw'} fontSize={'0.65vw'} onClick={this.handleClick} p={5} textColor={this.state.isClicked ? 'white' : 'black'} bg={this.state.isClicked ? 'darkturquoise' : 'var(--secondary-color)'}>{"#" + this.props.tagName}</Button>
        );
    }
}
export default Tags;