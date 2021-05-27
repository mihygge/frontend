import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import {
  Navbar,
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import LoginContainer from "../../containers/Login.container";

const Header = (props) => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  const handleLoginModal = () => setLoginModalIsOpen(!loginModalIsOpen);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const [celebrateUsdropdownOpen, setCelebrateDropdownOpen] = useState(false);
  const celebrateToggle = () =>
    setCelebrateDropdownOpen(!celebrateUsdropdownOpen);

  return (
    <React.Fragment>
      <header className="header-wrapper">
        <div className="custom-container">
          <Navbar>
            <a className="header-logo" href="/">
              <img src={logo} alt="Logo" />
              <span>miHygge</span>
            </a>
            <Nav className="nav-right flex-direction-mini w-50">
              <Nav className="nav-main">
                <Dropdown
                  nav
                  isOpen={celebrateUsdropdownOpen}
                  toggle={celebrateToggle}
                >
                  <DropdownToggle nav>Celebrate Us</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "storyRef",
                          },
                        }}
                      >
                        Our Story
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "missionRef",
                          },
                        }}
                      >
                        Our Mission
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "visionAndValuesRef",
                          },
                        }}
                      >
                        Our Vision and Values
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "leadershipAndCultureRef",
                          },
                        }}
                      >
                        Our Leadership & Culture
                      </Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "growthWithNatureRef",
                          },
                        }}
                      >
                        Growth With Nature
                      </Link>
                    </DropdownItem>
                    {/* <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "teamRef",
                          },
                        }}
                      >
                        Our Team
                      </Link>
                    </DropdownItem> */}
                    <DropdownItem>
                      <Link
                        to={{
                          pathname: "/celebrate-us",
                          state: {
                            activeRef: "reachUsRef",
                          },
                        }}
                      >
                        Reach Us
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle nav>New to miHygge</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <NavLink to="/ask-for-demo">Ask for Demo</NavLink>
                    </DropdownItem>
                    {/* Required later */}
                    {/* <NavLink to="^_^">Make an Appointment</NavLink>
                        NavLink to="^_^">Send Feedback</NavLink>
                        <NavLink to="^_^">FAQ</NavLink> */}
                  </DropdownMenu>
                </Dropdown>
              </Nav>
              <NavItem>
                <button
                  className="btn-theme btn-no-box btn-signin"
                  onClick={handleLoginModal}
                >
                  Sign In
                </button>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
      </header>
      <LoginContainer toggle={handleLoginModal} isOpen={loginModalIsOpen} />
    </React.Fragment>
  );
};

export default Header;
