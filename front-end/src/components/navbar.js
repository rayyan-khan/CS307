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


import { BsPlusSquare, BsPlusSquareFill } from 'react-icons/bs'
import { AiFillMessage, AiOutlineMessage } from 'react-icons/ai'
import { BiHome } from 'react-icons/bi'
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
            <BiHome size={25} />
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
                    {this.state.currSection === "post" ? <BsPlusSquareFill size={25} /> : <BsPlusSquare size={25} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/dms'>
                  {this.state.currSection === "dms" ? <AiFillMessage size={25} /> : <AiOutlineMessage size={25} />}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='/profile'>
                    {this.state.currSection === "profile" ? <RiProfileFill size={25} /> : <RiProfileLine size={25} />}
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
