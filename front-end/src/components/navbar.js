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


import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs'
import { AiFillMessage, AiOutlineMessage, AiOutlineHome } from 'react-icons/ai'
import { RiProfileLine, RiProfileFill } from 'react-icons/ri'


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      currSection: "homepage",
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
  }


  render() {

    let barFront = <MDBNavbarNav right>
      <div style={{ width: "16%" }}>
        <MDBContainer>
          <MDBNavbarBrand href='/homepage'>
            <IconButton style={{ backgroundColor: this.state.currSection === "homepage" ? "#AD343E" : "#ffffff", color: this.state.currSection === "homepage" ? "#ffffff" : "#000000" }} aria-label='Search database' icon={<AiOutlineHome />} />
          </MDBNavbarBrand>
        </MDBContainer>
      </div>
      <MDBNavbar className="position-absolute start-25" style={{ left: "42%", width: "16%", top: "10%" }}>
        <form onSubmit={this.submitForm} className="form-inline" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="md-form my-0">
            <input className="form-control mr-sm-2" value={this.state.searchQuery} type="text" placeholder="Search" onChange={this.handleChange} />
          </div>
        </form>
      </MDBNavbar>
    </MDBNavbarNav>

    if (sessionStorage.getItem("username") !== null) {
      return (
        <div style={{ height: "65px" }}>
          <MDBNavbar style={{ height: "100%", backgroundColor: "#151516" }} expand='lg'>
            {barFront}
            <div>
              <MDBNavbarNav right>
                <MDBNavbarItem>
                  <MDBNavbarLink style={{ color: "#ffffff" }} href='/post'>
                    {this.state.currSection === "post" ? <IconButton style={{ color: "white", backgroundColor: "#AD343E" }} aria-label='Create Post' icon={<BsPlusSquareFill />} /> : <IconButton style={{ color: "black", backgroundColor: "white" }} aria-label='Search database' icon={<BsPlusSquare />} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink style={{ color: "#ffffff" }} href='/dms'>
                    {this.state.currSection === "dms" ? <IconButton style={{ color: "white", backgroundColor: "#AD343E" }} aria-label='Direct Message' icon={<AiFillMessage />} /> : <IconButton style={{ color: "black", backgroundColor: "white" }} aria-label='Search database' icon={<AiOutlineMessage />} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink style={{ color: "#ffffff" }} href='/profile'>
                    {this.state.currSection === "profile" ? <IconButton style={{ color: "white", backgroundColor: "#AD343E" }} aria-label='Profile' icon={<RiProfileFill />} /> : <IconButton style={{ color: "black", backgroundColor: "white" }} aria-label='Search database' icon={<RiProfileLine />} />}
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
                  <Button onClick={this.goToSignup} style={{ backgroundColor: this.state.currSection === "signup" ? "#AD343E" : "#ffffff", color: this.state.currSection === "signup" ? "#ffffff" : "#000000", right: "25px" }} variant='solid'>
                    Signup
                  </Button>
                  <Button onClick={this.goToLogin} style={{ backgroundColor: this.state.currSection === "login" ? "#AD343E" : "#ffffff", color: this.state.currSection === "login" ? "#ffffff" : "#000000", right: "25px" }} variant='solid'>
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
