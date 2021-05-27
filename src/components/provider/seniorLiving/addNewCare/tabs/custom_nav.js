import React from 'react'
import classnames from 'classnames';
import { Nav, NavItem, NavLink} from 'reactstrap';
import { addCareTabDetails } from '../../addNewCare/addCareTabDetails';

const CustomNav = (props) => {
    const { setactiveTab, activeTab, isUpdate } = props
    return (
        <Nav>
            {
                addCareTabDetails &&
                addCareTabDetails.length>0 &&
                addCareTabDetails.map((tabDetails, index) => (
                    <NavItem key={index}>
                        <NavLink
                            disabled={isUpdate ? false : (activeTab !== tabDetails.tabId)}
                            className={classnames({ active: activeTab === tabDetails.tabId })}
                            onClick={() => { setactiveTab(tabDetails.tabId); }}
                        >
                            {tabDetails.tabHeading}
                        </NavLink>
                    </NavItem>
                ))
            }
        </Nav>
    )
}

export default CustomNav