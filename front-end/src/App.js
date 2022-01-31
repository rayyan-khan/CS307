import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";


import Navbar from './components/navbar';

import Signup from './layouts/new-user/signup';
import Login from './layouts/new-user/login';
import Homepage from './layouts/homepage';
import Profile from './layouts/logged-in-user/profile';
import DirectMessage from './layouts/logged-in-user/direct-message';
import MakePost from './layouts/logged-in-user/make-post';
import SearchResult from './layouts/search_results';


export default function App() {
  return (
    <div className="App">
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
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </Router>,
    </div>
  );
}
