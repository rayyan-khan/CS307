import './App.css'
import React from 'react'

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useParams,
} from 'react-router-dom'

import Navbar from './components/navbar/navbar.js'
import Signup from './layouts/new-user/signup'
import Login from './layouts/new-user/login'
import Homepage from './layouts/homepage/homepage'
import Profile from './layouts/logged-in-user/profile/profile'
import DirectMessage from './layouts/logged-in-user/direct-message'
import Verification from './layouts/logged-in-user/verification-page'
import SearchResult from './layouts/search-results'
import ScreenTooSmall from './components/screenTooSmall'
import CreatePost from './layouts/logged-in-user/create-post'
import PersonPostPage from './layouts/personPostPage.js'
import Onboarding from './layouts/new-user/onboarding/onboarding'
import axios from 'axios'

import { Box } from '@chakra-ui/react'
import { RiContactsBookLine } from 'react-icons/ri'

export default class App extends React.Component {
    render() {
        console.log(window.innerWidth)
        if (window.innerWidth < 575) {
            return (
                // show that Window is too small
                <ScreenTooSmall />
            )
        }

        const VerificationWrapper = () => {
            const params = useParams()
            return <Verification token={params.token} />
        }

        const PersonalPostPageWrapper = () => {
            const params = useParams()
            return <PersonPostPage postid={params.id} />
        }

        const ProfileWrapper = () => {
            const params = useParams()
            return <Profile username={params.username} />
        }

        const PrivateRoute = ({ loadComponent }) => {
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            axios.post("http://localhost:5000/api/test-token").then((res) => {
                if (res.data === 'false') {
                    let url = window.location.href;
                    window.location.href = url.substring(0, url.indexOf("/")) + "/login";
                }
            });
            return loadComponent
        }


        const SignUpToHomepageRoute = ({ loadComponent }) => {
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            axios.get("http://localhost:5000/api/test-token").then((res) => {
                console.log(res.data)
                if (res.data === 'true') {
                    let url = window.location.href;
                    window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";
                }
            });
            return loadComponent
        }

        return (
            <Box className={'color-switch'} h={'100vh'}>
                <div className='App'>
                    <Navbar />
                    <Router>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate replace to="/homepage" />}
                            />
                            <Route path="/signup"

                                element={
                                    <SignUpToHomepageRoute loadComponent={<Signup />} />

                                }
                            />
                            <Route path="/login"

                                element={
                                    <SignUpToHomepageRoute loadComponent={<Login />} />

                                }
                            />
                            <Route path="/homepage" element={<Homepage />} />
                            <Route
                                path="/createPost"
                                element={
                                    <PrivateRoute loadComponent={<CreatePost />} />
                                }
                            />
                            <Route path="/profile" element={<ProfileWrapper />} />
                            <Route
                                path="/profile/:username"
                                element={<ProfileWrapper />}
                            />
                            <Route path="/dms" element={<DirectMessage />} />
                            {/* <Route path="/createPost" element={<CreatePost />} /> */}
                            <Route path="/search" element={<SearchResult />} />
                            <Route
                                path="/personalPostPage/:id"
                                element={<PersonalPostPageWrapper />}
                            />
                            <Route
                                path="/verification/:token"
                                element={<VerificationWrapper />}
                            />
                            <Route path="/onboarding" element={<Onboarding />} />
                        </Routes>
                    </Router>
                </div>
            </Box>
        )
    }
}
