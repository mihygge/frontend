import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import SuggestedPlans from './suggestedPlans';
import AllPlans from './allPlans';

const SubscriptionTab = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return(
        <div className="tabs-subscription tabs-secondary">
            <Nav>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Suggested subscription plans
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        All Plans
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    { activeTab === '1' ? <SuggestedPlans /> : null }
                </TabPane>
                <TabPane tabId="2">
                    { activeTab === '2' ? <AllPlans /> : null }   
                </TabPane>
            </TabContent>
        </div>
    )
}

export default SubscriptionTab;