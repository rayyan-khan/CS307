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
} from 'mdb-react-ui-kit'


function Navbar() {  
  const [username, setUsername] = useState("");

  function handleUsernameChange(username) {
    setUsername(username);
    localStorage.setItem("username", username);
  }


  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/homepage'>Brand</MDBNavbarBrand>

        <MDBCollapse navbar>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/signup'>
                Signup
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/login'>Login</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>

          <form className='d-flex input-group w-auto'>
            <input type='search' value={username} className='form-control' placeholder='Type query' aria-label='Search' onChange={(username) => handleUsernameChange(username.target.value)}/>
          </form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
    );
}


export default Navbar;