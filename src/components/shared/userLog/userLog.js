import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './_user-log.scss';
import BankDetailsPop from '../../bankDetails';
import { withRouter, Link } from 'react-router-dom';
import destroySession from '../../../api/sessions/logout'
import { connect } from 'react-redux';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'

const UserLog = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalBankDetails, setModalBankDetails] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
    const toggleBankDetailsPop = () => setModalBankDetails(!modalBankDetails);

    const [isLogout, setLogout] = useState(false)

    const [userDetail] = useLocalStorage('userDetails', {})
    const userRole = userDetail.role;
    let accountDetailsRedirectTo = null;
    if(userRole==='provider'){
        accountDetailsRedirectTo="/account-details"
    }
    else if(userRole==='customer' || userRole==='social_worker'){
        accountDetailsRedirectTo="/account-details-customer"
    }

    const logout = () => {
        destroySession().then(() => {
            localStorage.clear()
            setLogout(true)
        })
    }
    
    if(isLogout){
        props.history.push("/")
        props.history.go()
    }

    return (
        <>
            <Dropdown isOpen={dropdownOpen} toggle={toggle} className="user-log-dropdown">
                <DropdownToggle>
                    <div className="user">
                        {
                            <span>{props.username ? props.username.charAt(0) : 'U' }</span>
                        }
                        {
                            props.username ? 
                            <strong>{props.username}</strong> : <strong>User Name</strong>
                        }
                    </div>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <Link to={accountDetailsRedirectTo}>Manage account</Link>
                    </DropdownItem>
                    {
                        userRole === 'provider' &&
                        <DropdownItem onClick={toggleBankDetailsPop}>Add/Edit Bank Details</DropdownItem>
                    }
                    <DropdownItem onClick={logout}>Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        <BankDetailsPop isOpen={modalBankDetails} toggle={toggleBankDetailsPop} />
      </>
    )
}

function mapStateToProps(state) {
    return {
        username: state.provider_header.username
    };
}

export default connect(mapStateToProps, null)(withRouter(UserLog));