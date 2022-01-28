import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,  
} from "react-router-dom";


import Navbar from './components/navbar';

import Signup from './layouts/new-user/signup';
import Login from './layouts/new-user/login';
import Homepage from './layouts/logged-in-user/home-page';


export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </Router>,
    </div>
  );
}
