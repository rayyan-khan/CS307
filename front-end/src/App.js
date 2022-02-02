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

export default class App extends React.Component {
  render() {
    console.log(window.innerWidth);
    if (window.innerWidth < 1000) {
      return (
        // show that Window is too small
        <ScreenTooSmall />
      );
    }

    const VerificationWrapper = props => {
      const params = useParams();
      return <Verification token={params.token} />
    }

    return (
      <div>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate replace to="/homepage" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dms" element={<DirectMessage />} />
            <Route path="/post" element={<MakePost />} />
            <Route path="/postPage" element={<PostPage />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/verification/:token" element={<VerificationWrapper />} />
          </Routes>
        </Router>
      </div >
    );
  }
}
