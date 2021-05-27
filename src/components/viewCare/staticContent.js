import React from 'react';

const StaticContent = ({ description, area_description }) => {
    return(
        <div className="section-static-content">
            <p>{description}</p>
            <p>{area_description}</p>
        </div>
    )
}

export default StaticContent;