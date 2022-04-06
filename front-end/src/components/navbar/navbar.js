import '../../../node_modules/mdb-react-ui-kit/dist/css/mdb.min.css'

import React from 'react'
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
} from 'mdb-react-ui-kit'

import { Button, IconButton, Stack, Box } from '@chakra-ui/react'

import axios from 'axios'

import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs'
import {
    AiFillMessage,
    AiOutlineMessage,
    AiOutlineHome,
    AiOutlineLogout,
} from 'react-icons/ai'
import { FaRegBookmark } from 'react-icons/fa'

import { RiProfileLine, RiProfileFill } from 'react-icons/ri'
import SearchBar from '../searchBar'
import './navbar.css'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchQuery: '',
            currSection: 'homepage',
            validToken: false,
            username: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    handleChange(event) {
        this.setState({ searchQuery: event.target.value })
    }

    submitForm(event) {
        event.preventDefault()
        let searchQuery = this.state.searchQuery
        console.log(searchQuery)
    }

    goToSignup() {
        let url = window.location.href
        window.location.href = url.substring(0, url.indexOf('/')) + '/signup'
    }

    goToLogin() {
        let url = window.location.href
        window.location.href = url.substring(0, url.indexOf('/')) + '/login'
    }

    logout() {
        localStorage.removeItem('token')
    }

    async componentWillMount() {
        let url = window.location.href
        let currSection = url.substring(url.lastIndexOf('/') + 1)
        this.setState({ currSection: currSection })
        console.log(currSection)
        console.log('lets see')
        console.log(localStorage.getItem('token'))
        axios.defaults.headers.common['authorization'] =
            localStorage.getItem('token')
        try {
            await axios
                .get('http://localhost:5000/api/test-token/')
                .then((res) => {
                    console.log(res.data)
                    if (res.data === 'true') {
                        this.setState({ validToken: true })
                        return
                    }
                })
            if (!this.state.validToken) {
                localStorage.removeItem('token')
            }
        } catch (e) {
            console.log(e)
            localStorage.removeItem('token')
        }

        if (localStorage.getItem('token') != null) {
            axios
                .get('http://localhost:5000/api/getUserFromHeader/')
                .then((res) => {
                    console.log(res.data)
                    this.setState({ username: res.data.username })
                })
        }
    }

    render() {
        let barFront = (
            <MDBNavbarNav>
                <div style={{ width: '16%' }}>
                    <MDBContainer>
                        <MDBNavbarBrand href="/homepage">
                            <IconButton
                                style={{
                                    backgroundColor:
                                        this.state.currSection === 'homepage'
                                            ? 'darkturquoise'
                                            : 'var(--secondary-color)',
                                    color:
                                        this.state.currSection === 'homepage'
                                            ? '#ffffff'
                                            : '#000000',
                                }}
                                icon={<AiOutlineHome />}
                            />
                        </MDBNavbarBrand>
                    </MDBContainer>
                </div>
                <div
                    className="position-absolute"
                    style={{
                        top: '15px',
                        left: '40%',
                        width: '20%',
                        textAlign: 'left',
                    }}
                >
                    <SearchBar />
                </div>
            </MDBNavbarNav>
        )

        if (this.state.validToken) {
            return (
                <Box height={'70px'}>
                    <div
                        style={{ height: '65px', position: 'sticky', top: '0' }}
                    >
                        <MDBNavbar
                            className="color-switch"
                            style={{ height: '100%' }}
                            expand="sm"
                        >
                            {barFront}
                            <div>
                                <MDBNavbarNav>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink
                                            style={{ color: '#ffffff' }}
                                            href="/createPost"
                                        >
                                            {this.state.currSection ===
                                                'createPost' ? (
                                                <IconButton
                                                    style={{
                                                        backgroundColor:
                                                            'darkturquoise',
                                                        color: 'white',
                                                    }}
                                                    icon={<BsPlusSquareFill />}
                                                />
                                            ) : (
                                                <IconButton
                                                    style={{
                                                        color: 'black',
                                                        backgroundColor:
                                                            'var(--secondary-color)',
                                                    }}
                                                    icon={<BsPlusSquare />}
                                                />
                                            )}
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink
                                            style={{ color: '#ffffff' }}
                                            href="/bookmarks"
                                        >
                                            {this.state.currSection ===
                                                'bookmarks' ? (
                                                <IconButton
                                                    style={{
                                                        backgroundColor:
                                                            'darkturquoise',
                                                        color: 'white',
                                                    }}
                                                    icon={<FaRegBookmark />}
                                                />
                                            ) : (
                                                <IconButton
                                                    style={{
                                                        color: 'black',
                                                        backgroundColor:
                                                            'var(--secondary-color)',
                                                    }}
                                                    icon={<FaRegBookmark />}
                                                />
                                            )}
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink
                                            style={{ color: '#ffffff' }}
                                            href="/dms"
                                        >
                                            {this.state.currSection ===
                                                'dms' ? (
                                                <IconButton
                                                    style={{
                                                        backgroundColor:
                                                            'darkturquoise',
                                                        color: 'white',
                                                    }}
                                                    icon={<AiOutlineMessage />}
                                                />
                                            ) : (
                                                <IconButton
                                                    style={{
                                                        color: 'black',
                                                        backgroundColor:
                                                            'var(--secondary-color)',
                                                    }}
                                                    icon={<AiOutlineMessage />}
                                                />
                                            )}
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink
                                            style={{ color: '#ffffff' }}
                                            href={
                                                '/profile/' +
                                                this.state.username
                                            }
                                        >
                                            {this.state.currSection ===
                                                this.state.username ? (
                                                <IconButton
                                                    style={{
                                                        backgroundColor:
                                                            'darkturquoise',
                                                        color: 'white',
                                                    }}
                                                    icon={<RiProfileLine />}
                                                />
                                            ) : (
                                                <IconButton
                                                    style={{
                                                        color: 'black',
                                                        backgroundColor:
                                                            'var(--secondary-color)',
                                                    }}
                                                    icon={<RiProfileLine />}
                                                />
                                            )}
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                    <MDBNavbarItem>
                                        <MDBNavbarLink
                                            style={{ color: '#ffffff' }}
                                            href="/homepage"
                                        >
                                            <IconButton
                                                style={{
                                                    color: 'black',
                                                    backgroundColor:
                                                        'var(--secondary-color)',
                                                }}
                                                icon={<AiOutlineLogout />}
                                                onClick={this.logout}
                                            />
                                        </MDBNavbarLink>
                                    </MDBNavbarItem>
                                </MDBNavbarNav>
                            </div>
                        </MDBNavbar>
                    </div>
                </Box>
            )
        } else {
            return (
                <div
                    className="color-switch"
                    style={{ height: '65px', position: 'sticky', top: '0' }}
                >
                    <MDBNavbar style={{ height: '100%' }} expand="sm">
                        {barFront}
                        <div style={{ top: '100px' }}>
                            <MDBNavbarNav right>
                                <Stack direction="row" spacing={4}>
                                    <Button
                                        onClick={this.goToSignup}
                                        style={{
                                            backgroundColor:
                                                this.state.currSection ===
                                                    'signup'
                                                    ? 'darkturquoise'
                                                    : 'var(--secondary-color)',
                                            color:
                                                this.state.currSection ===
                                                    'signup'
                                                    ? '#ffffff'
                                                    : '#000000',
                                            right: '25px',
                                        }}
                                        variant="solid"
                                    >
                                        Signup
                                    </Button>
                                    <Button
                                        onClick={this.goToLogin}
                                        style={{
                                            backgroundColor:
                                                this.state.currSection ===
                                                    'login'
                                                    ? 'darkturquoise'
                                                    : 'var(--secondary-color)',
                                            color:
                                                this.state.currSection ===
                                                    'login'
                                                    ? '#ffffff'
                                                    : '#000000',
                                            right: '25px',
                                        }}
                                        variant="solid"
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </MDBNavbarNav>
                        </div>
                    </MDBNavbar>
                </div>
            )
        }
    }
}

export default Navbar
