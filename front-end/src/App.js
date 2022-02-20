import './App.css'
import React from 'react'

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useParams,
} from 'react-router-dom'

import Navbar from './components/navbar'

import Signup from './layouts/new-user/signup'
import Login from './layouts/new-user/login'
import Homepage from './layouts/homepage'
import Profile from './layouts/logged-in-user/profile'
import DirectMessage from './layouts/logged-in-user/direct-message'
import Verification from './layouts/logged-in-user/verification-page'
import SearchResult from './layouts/search-results'
import ScreenTooSmall from './components/screenTooSmall'
import PostPage from './layouts/logged-in-user/post-page'
import CreatePost from './layouts/logged-in-user/create-post'
import PersonPostPage from './layouts/personPostPage.js'
import Onboarding from './layouts/new-user/onboarding/onboarding'
import axios from 'axios'

export default class App extends React.Component {
    render() {
        console.log(window.innerWidth)
        if (window.innerWidth < 1000) {
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

            if (params.username == null) {
                //Viewing /profile
                if (sessionStorage.getItem('username') == null) {
                    //Viewing /profile and not logged in
                    return <Navigate replace to="/homepage" />
                } else {
                    //Viewing /profile and logged in
                    return (
                        <Profile
                            username={sessionStorage.getItem('username')}
                        />
                    )
                }
            } else {
                //Viewing a specific user's profile
                return <Profile username={params.username} />
            }
        }

        const PrivateRoute = ({ loadComponent }) => {
            if (sessionStorage.getItem('username') == null) {
                //Not logged in
                return <Navigate replace to="/signup" />
            } else return loadComponent
        }


        const SignUpToHomepageRoute = ({ loadComponent }) => {
            axios.post("http://localhost:5000/api/test-token").then((res) => {
                if (res.data === 'true') {
                    let url = window.location.href;
                    window.location.href = url.substring(0, url.indexOf("/")) + "/homepage";

                }
            });
            return loadComponent
        }

        return (
            <div className={'App'}>
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
                        <Route path="/login" element={<Login />} />
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
                        <Route path="/postPage" element={<PostPage />} />
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
        )
    }
}
