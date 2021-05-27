import React from 'react';
import Login from '../components/shared/User/Login'

import { withRouter } from "react-router";
import { connect } from 'react-redux'
import useLocalStorage from '../effects/LocalStorage/use-local-storage';
import { setusername } from '../manageState/ProviderHeader'

const LoginContainer = (props) => {
    const [_, setToken] = useLocalStorage('login_token', '');
    const [_username, setUserName] = useLocalStorage('username', '');
    const [_userDetails, setUserDetails] = useLocalStorage('userDetails', {})

    let componentProps = {
        setToken,
        setUserName,
        setUserDetails
    }
    return (<Login {...props} {...componentProps} />)
}

function mapDispatchToProps(dispatch) {
    return {
        setLoginUsername: username => dispatch(setusername({username:username}))
    };
} 
export default connect(null, mapDispatchToProps, null, {
    pure: false
})(withRouter(LoginContainer));