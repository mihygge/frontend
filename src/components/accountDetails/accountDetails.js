import React, { useState } from 'react';
import './_account-details.scss';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import SubscriptionTab from './subscription';
import MyProfileTab from './myProfile';
import HeaderWithUser from '../commons/headerWithUserLogin';
import FooterSection from '../commons/copyrights';

const AccountDetails = (props) => {

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
                                    Subscription
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}
                                >
                                    My Profile
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <SubscriptionTab />
                            </TabPane>
                            <TabPane tabId="2">
                                <MyProfileTab />
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>  
            <FooterSection />
        </div>
    )
}

export default AccountDetails;