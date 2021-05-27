import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast';

const CallbackFailure = (props) => {
    useEffect(() =>{
        cogoToast.success("Something went wrong. Please try to connect with payment service again.");
        setTimeout(function() { 
            props.history.push('/provider');
            props.history.go();
        }, 1000);
    }, [])
    
    return(
        <></>
    )
}

export default withRouter(CallbackFailure)