import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import MyProfileTab from './myProfile';
import WhishList from './whishList';
import HeaderWithUser from '../commons/headerWithUserLogin';
import Bookings from './bookings';
import FooterSection from '../commons/copyrights';

const AccountDetailsCustomer = (props) => {

    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return(
        <div className="wrapper-account-details">
            <HeaderWithUser />
            <div className="wrapper-content">
                <div className="custom-container-mini">
                    <h2>Account Details</h2>
                    <div className="tabs-account-main nav-custom-tabs">
                        <Nav>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggle('1'); }}
                                >
                                    Booking
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}
                                >
                                    Wishlist
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '3' })}
                                    onClick={() => { toggle('3'); }}
                                >
                                    Profile
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                { activeTab === '1' ?<Bookings /> : null } 
                            </TabPane>
                            <TabPane tabId="2">
                                { activeTab === '2' ? <WhishList /> : null }   
                            </TabPane>
                            <TabPane tabId="3">
                                { activeTab === '3' ? <MyProfileTab /> : null }   
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>  
            <FooterSection />
        </div>
    )
}

export default AccountDetailsCustomer;