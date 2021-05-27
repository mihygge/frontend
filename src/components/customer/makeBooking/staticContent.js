import React from 'react';

const FacilityInfo = (props) => {
    return (
        <div className="facility-info-brief">
            <h2>{props.title}</h2> 
            <p>{props.description}</p>
        </div>
    )
}

export default FacilityInfo;