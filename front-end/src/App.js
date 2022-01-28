import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import Navbar from './components/navbar';

import Signup from './layouts/new-user/signup';
import Login from './layouts/new-user/login';
import Homepage from './layouts/logged-in-user/home-page';


export default function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="homepage" element={<Homepage />} />
        </Routes>
      </BrowserRouter>,
    </div>
  );
}
