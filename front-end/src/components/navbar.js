import "../../node_modules/mdb-react-ui-kit/dist/css/mdb.min.css";

import React, { useState } from 'react';

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
} from 'mdb-react-ui-kit';


let testbar = <>
  <MDBContainer fluid>
    <MDBNavbarBrand href='/homepage'>
      Purdue Circle
    </MDBNavbarBrand>
  </MDBContainer>
  <MDBNavbar className="position-absolute start-25" style={{ left: "42%", width: "16%" }}>
    <form className="form-inline" style={{ width: "150%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <input className="form-control mr-sm-5" type="search" placeholder="Search" aria-label="" />
    </form>
  </MDBNavbar>
</>

function Navbar() {
  if (localStorage.getItem("username") !== null) {
    return (
      <MDBNavbar expand='lg' dark bgColor='dark'>
        {testbar}
        <div style={{ top: "10%" }}>
          <MDBNavbarNav right>
            <MDBNavbarItem>
              <MDBNavbarLink href='/post'>Post</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/dms'>DM's</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/profile'>Profile</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </div>
      </MDBNavbar>
    )
  } else {
    return (
      <MDBNavbar expand='lg' dark bgColor='dark'>
        {testbar}
        <div style={{ top: "10%" }}>
          <MDBNavbarNav right>
            <MDBNavbarItem>
              <MDBNavbarLink href='/signup'>Signup</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/login'>Login</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </div>
      </MDBNavbar>
    );
  }
}


export default Navbar;
