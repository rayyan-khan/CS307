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

import { BsPlusSquare } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { BiMessageRounded, BiHome } from 'react-icons/bi'


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
    sessionStorage.setItem("search_query", searchQuery);
  }

  render() {

    let barFront = <MDBNavbarNav right>
      <div style={{ width: "16%" }}>
        <MDBContainer>
          <MDBNavbarBrand href='/homepage'>
            <BiHome size={25}/>
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
        <div>
          <MDBNavbar expand='lg' dark bgColor='dark'>
            {barFront}
            <div>
              <MDBNavbarNav right>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/post'>
                    <BsPlusSquare size={25}/>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/dms'>
                    <BiMessageRounded size={25}/>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/profile'>
                    <CgProfile size={25}/>
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
          <MDBNavbar style={{ height: "100%" }} expand='lg' dark bgColor='dark'>
            {barFront}
            <div style={{ top: "100px" }}>
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
        </div>
      );
    }
  }
}


export default Navbar;
