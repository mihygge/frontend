import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast'

const CallbackSuccess = (props) => {
    useEffect(() =>{
        cogoToast.success("Successfully connected to payment service");
        setTimeout(function() { 
            props.history.push('/provider');
            props.history.go();
        }, 1000);
    }, [])
    
    return(
        <></>
    )
}

export default withRouter(CallbackSuccess)