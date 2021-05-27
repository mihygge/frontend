import React from 'react';

const CardEmpower = (props) => {
    const { src, title, link } = props;
    return(
        <a href={link} target="_blank" rel="noopener noreferrer">
            <div className="empower-list-item">
                <img src={src} alt={title} />
                <h3>{title}</h3>
            </div>
        </a>
    )
}

export default CardEmpower;
