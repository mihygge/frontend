import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import BasicDetails from './basicDetails';
import ChangePassword from './changePassword';
import PaymentInformation from '../../accountDetails/paymentInformation';

const MyProfileTab = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return(
        <div className="tabs-my-profile">
            <Nav>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Basic Details
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        Change Password
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => { toggle('3'); }}
                    >
                        Payment Information
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <BasicDetails />
                </TabPane>
                <TabPane tabId="2">
                    <ChangePassword />
                </TabPane>
                <TabPane tabId="3">
                    <PaymentInformation />
                </TabPane>
            </TabContent>
        </div>
    )
}

export default MyProfileTab;