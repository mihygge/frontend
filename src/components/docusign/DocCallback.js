import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import docuSignCallback from '../../api/subscription/ds_return';

const DocCallback = (props) => {
    useEffect(() =>{
        docuSignCallback()
            .then(() => {
                props.history.push("/account-details")
                props.history.go()
            })
            .catch((err) => console.log(err))
    }, [])
    
    return(
        <></>
    )
}

export default withRouter(DocCallback)