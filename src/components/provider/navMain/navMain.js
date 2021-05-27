import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import cx from "classnames";

const NavMain = (props) => {
    const currentLocation = window.location.pathname;
    return (
        <div className="nav-provider">
            <Nav>
                <NavItem>
                    <NavLink
                        href="/provider"
                        className={
                            cx({
                                'active' : currentLocation ==='/provider'
                                || currentLocation ==='/provider/senior-living/add-new-care'
                                || currentLocation.includes('/provider/senior-living/update/')
                            })
                        }
                    >Senior <br /> Living</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/provider/home-share" 
                             className={cx({
                                            'active' : currentLocation ==='/provider/home-share' 
                                            || currentLocation ==='/provider/home-share/new-home-share'
                                            || currentLocation.includes('/provider/home-share/update/')
                                        })
                                }
                    >Home <br /> Share</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/provider/view-booking" className={cx({'active' : currentLocation ==='/provider/view-booking'})}>View <br /> Booking</NavLink>
                </NavItem>
            </Nav>
        </div>
    )
}

export default NavMain;
