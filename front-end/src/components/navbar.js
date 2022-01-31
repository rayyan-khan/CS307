import "../../node_modules/mdb-react-ui-kit/dist/css/mdb.min.css";

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
} from 'mdb-react-ui-kit';

import SearchResult from "../layouts/search_results";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
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
    url = url.substring(0, url.indexOf("/"));
    window.location.href = url + "/search";
    localStorage.setItem("search_query", searchQuery);
  }

  render() {

    let barFront = <>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/homepage'>
          Purdue Circle
        </MDBNavbarBrand>
      </MDBContainer>
      <MDBNavbar className="position-absolute start-25" style={{ left: "42%", width: "16%" }}>
        <form onSubmit={this.submitForm} className="form-inline" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="md-form my-0">
            <input className="form-control mr-sm-2" value={this.state.searchQuery} type="text" placeholder="Search" onChange={this.handleChange} />
          </div>
        </form>
      </MDBNavbar>
    </>

    if (localStorage.getItem("username") !== null) {
      return (
        <div>
          <MDBNavbar style={{ height: "200%" }} expand='lg' dark bgColor='dark'>
            {barFront}
            <div style={{ top: "15%" }}>
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
        </div>
      )
    } else {
      return (
        <MDBNavbar expand='lg' dark bgColor='dark'>
          {barFront}
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
}


export default Navbar;
