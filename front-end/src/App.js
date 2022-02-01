import './App.css';

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
import Profile from './layouts/logged-in-user/profile';
import DirectMessage from './layouts/logged-in-user/direct-message';
import MakePost from './layouts/logged-in-user/make-post';
import SearchResult from './layouts/search_results';
import Homepage from './layouts/logged-in-user/home-page';
import Verification from './layouts/logged-in-user/verification-page'
import React from 'react';


export default function App() {
  const VerificationWrapper = props => {
    const params = useParams();
    console.log(params)
    return <Verification token={params.token} />
  }

  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/homepage" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
<<<<<<< HEAD
          <Route path="/profile" element={<Profile />} />
          <Route path="/dms" element={<DirectMessage />} />
          <Route path="/post" element={<MakePost />} />
          <Route path="/search" element={<SearchResult />} />
=======
          <Route path="/verification/:token" element={<VerificationWrapper />} />
>>>>>>> 04f94ba (Front end verification link proof of concept)
        </Routes>
      </Router>
    </div>
  );
}
