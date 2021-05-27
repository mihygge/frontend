import React, { useState } from 'react';
import FormDetails from './formDetails';
import HeaderWithUser from '../../commons/headerWithUserLogin';
import { Nav, NavItem, NavLink, } from 'reactstrap';
import './_checkout.scss';
import Copyrights from '../../commons/copyrights';

import { withRouter } from 'react-router-dom';

const Checkout = ({ location }) => {
    return ( location?.state &&
        <div className="wrapper-account-details">
            <HeaderWithUser />
            <div className="wrapper-content">
                <div className="custom-container-checkout">
                    <h2>Book Care & Checkout</h2>
                    <div className="tabs-add-care nav-custom-tabs">
                        <Nav>
                            <NavItem>
                                <NavLink className="active nav-link">
                                    Your Details
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <FormDetails
                            bookingDetails={ location?.state }
                            noOfGuest={location?.state?.selectedBed?.length}
                        />
                    </div>
                    <div className="credit-card-section-wrapper">
                    <div className="section-card-holder">
                    
                </div>
                        </div>
                </div>
            </div>
            <Copyrights />
        </div>
    );
};

export default withRouter(Checkout);