import "../../node_modules/mdb-react-ui-kit/dist/css/mdb.min.css";

import React from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
} from 'mdb-react-ui-kit';

import {
  Button,
  IconButton,
  Stack
} from '@chakra-ui/react';

import axios from 'axios';


import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs'
import { AiFillMessage, AiOutlineMessage, AiOutlineHome } from 'react-icons/ai'
import { RiProfileLine, RiProfileFill } from 'react-icons/ri'
import SearchBar from './searchBar'


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      currSection: "homepage",
      validToken: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleChange(event) {
    this.setState({ searchQuery: event.target.value });
  }

  submitForm(event) {
    event.preventDefault();
    let searchQuery = this.state.searchQuery;
    console.log(searchQuery);
    let url = window.location.href;
    window.location.href = url.substring(0, url.indexOf("/")) + "/search";
    sessionStorage.setItem("search_query", searchQuery);
  }

  goToSignup() {
    let url = window.location.href;
    window.location.href = url.substring(0, url.indexOf("/")) + "/signup";
  }

  goToLogin() {
    let url = window.location.href;
    window.location.href = url.substring(0, url.indexOf("/")) + "/login";
  }


  componentWillMount() {
    let url = window.location.href;
    let currSection = url.substring(url.lastIndexOf("/") + 1);
    this.setState({ currSection: currSection });
    console.log(currSection);
    console.log('lets see')
    console.log(sessionStorage.getItem('token'))
    try {
      axios.get("http://localhost:5000/api/test-token/token=" + sessionStorage.getItem('token')).then((res) => {
        console.log(res.data);
        if (res.data === 'true') {
          this.setState({ validToken: true });
          console.log('done')
        }
      });
    } catch (e) {
      console.log(e);
    }

  }


  render() {
    let barFront =
      <MDBNavbarNav right>
        <div style={{ width: "16%" }}>
          <MDBContainer>
            <MDBNavbarBrand href='/homepage'>
              <IconButton style={{ backgroundColor: this.state.currSection === "homepage" ? "darkturquoise" : "#ffffff", color: this.state.currSection === "homepage" ? "#ffffff" : "#000000" }} icon={<AiOutlineHome />} />
            </MDBNavbarBrand>
          </MDBContainer>
        </div>
        <div className="position-absolute" style={{ left: "42%", width: "16%", textAlign: "left" }}>
          <SearchBar onSubmit={this.submitForm} />
        </div>
      </MDBNavbarNav>

    if (this.state.validToken) {
      return (
        <div style={{ height: "65px" }}>
          <MDBNavbar style={{ height: "100%", backgroundColor: "#151516" }} expand='lg'>
            {barFront}
            <div>
              <MDBNavbarNav right>
                <MDBNavbarItem>
                  <MDBNavbarLink style={{ color: "#ffffff" }} href='/createPost'>
                    {this.state.currSection === "createPost" ? <IconButton style={{ backgroundColor: "darkturquoise", color: "white" }} icon={<BsPlusSquareFill />} /> : <IconButton style={{ color: "black", backgroundColor: "white" }} icon={<BsPlusSquare />} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink style={{ color: "#ffffff" }} href='/dms'>
                    {this.state.currSection === "dms" ? <IconButton style={{ backgroundColor: "darkturquoise", color: "white" }} icon={<AiFillMessage />} /> : <IconButton style={{ color: "black", backgroundColor: "white" }} icon={<AiOutlineMessage />} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink style={{ color: "#ffffff" }} href='/profile'>
                    {this.state.currSection === "profile" ? <IconButton style={{ backgroundColor: "darkturquoise", color: "white" }} icon={<RiProfileFill />} /> : <IconButton style={{ color: "black", backgroundColor: "white" }} icon={<RiProfileLine />} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </div>
          </MDBNavbar>
        </div>
      )
    } else {
      return (
        <div style={{ height: "65px" }}>
          <MDBNavbar style={{ height: "100%", backgroundColor: "#151516" }} expand='lg'>
            {barFront}
            <div style={{ top: "100px" }}>
              <MDBNavbarNav right>
                <Stack direction='row' spacing={4}>
                  <Button onClick={this.goToSignup} style={{ backgroundColor: this.state.currSection === "signup" ? "darkturquoise" : "#ffffff", color: this.state.currSection === "signup" ? "#ffffff" : "#000000", right: "25px" }} variant='solid'>
                    Signup
                  </Button>
                  <Button onClick={this.goToLogin} style={{ backgroundColor: this.state.currSection === "login" ? "darkturquoise" : "#ffffff", color: this.state.currSection === "login" ? "#ffffff" : "#000000", right: "25px" }} variant='solid'>
                    Login
                  </Button>
                </Stack>
              </MDBNavbarNav>
            </div>
          </MDBNavbar>
        </div>
      );
    }
  }
}


export default Navbar;
