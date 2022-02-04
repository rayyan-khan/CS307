import './App.css';
import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams
} from "react-router-dom";


import Navbar from './components/navbar';

import Signup from './layouts/new-user/signup';
import Login from './layouts/new-user/login';
import Homepage from './layouts/homepage';
import Profile from './layouts/logged-in-user/profile';
import DirectMessage from './layouts/logged-in-user/direct-message';
import MakePost from './layouts/logged-in-user/make-post';
import Verification from './layouts/logged-in-user/verification-page'
import SearchResult from './layouts/search-results';
import ScreenTooSmall from './components/screenTooSmall';
import PostPage from './layouts/logged-in-user/post-page';
import CreatePost from './layouts/logged-in-user/create-post';

export default class App extends React.Component {
  render() {
    console.log(window.innerWidth);
    if (window.innerWidth < 1000) {
      return (
        // show that Window is too small
        <ScreenTooSmall />
      );
    }
    
    const VerificationWrapper = () => {
      const params = useParams();
      return <Verification token={params.token} />
    }

    const ProfileWrapper = () => {
      const params = useParams();
      
      if (params.username == null) {
        //Viewing /profile
        if (sessionStorage.getItem('username') == null) {
          //Viewing /profile and not logged in
          return <Navigate replace to="/homepage" />
        } else {
          //Viewing /profile and logged in
          return <Profile username={sessionStorage.getItem('username')} />
        }
      } else {
        //Viewing a specific user's profile
        return <Profile username={params.username} />
      }
    }
    
    return (
      <div style={{ backgroundColor: "#151516" }}>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate replace to="/homepage" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/profile" element={<ProfileWrapper />} />
            <Route path="/profile/:username" element={<ProfileWrapper />} />
            <Route path="/dms" element={<DirectMessage />} />
            <Route path="/post" element={<MakePost />} />
            <Route path= "/createPost" element = {<CreatePost />} />
            <Route path="/postPage" element={<PostPage />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/verification/:token" element={<VerificationWrapper />} />
          </Routes>
        </Router>
      </div >
    );
  }
}
