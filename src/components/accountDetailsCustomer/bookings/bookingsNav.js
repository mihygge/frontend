import React from 'react';
import classnames from 'classnames';

import { PAST, ACTIVE, CANCELLED } from './constants';
import { Nav, NavItem, NavLink } from 'reactstrap';

const BookingsNav = (props) => {
    const { activeTab, toggleTabs, isLoading, totalRecords } = props;

    const showTotalRecords = (tab = null) => {
        if (activeTab !== tab) return;
        return isLoading ? '(...)' : `(${totalRecords})`;
    };

    return (
        <Nav>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === null })}
                    onClick={() => toggleTabs()}
                >
                    All Bookings {showTotalRecords()}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === ACTIVE })}
                    onClick={() => toggleTabs(ACTIVE)}
                >
                    Active Bookings {showTotalRecords(ACTIVE)}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === PAST })}
                    onClick={() => toggleTabs(PAST)}
                >
                    Past Bookings {showTotalRecords(PAST)}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === CANCELLED })}
                    onClick={() => toggleTabs(CANCELLED)}
                >
                    Cancelled Bookings {showTotalRecords(CANCELLED)}
                </NavLink>
            </NavItem>
        </Nav>
    );
};

export default BookingsNav;
