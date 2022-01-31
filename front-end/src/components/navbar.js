import "../../node_modules/mdb-react-ui-kit/dist/css/mdb.min.css";

import React, { useState } from 'react';
import { connect } from "react-redux";

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBCollapse
} from 'mdb-react-ui-kit';

import logo from "../assets/PurdueLogo.jpeg";

function Navbar() {  
  const [username, setUsername] = useState("");

  function handleUsernameChange(username) {
    setUsername(username);
    localStorage.setItem("username", username);
  }


  return (
    <MDBNavbar expand='lg' dark bgColor='dark'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/homepage'>
              Purdue Circle
        </MDBNavbarBrand>
      </MDBContainer>
      <MDBNavbarNav left className="position-absolute start-25" style={{ left: "45%" }}>
          <MDBNavbarItem>
            <form className="form-inline">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              </form>
          </MDBNavbarItem>
        </MDBNavbarNav>
    </MDBNavbar>
    );
}


export default Navbar;


<MDBNavbarNav>

</MDBNavbarNav>