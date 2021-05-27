import React from 'react';
import parkingIcon from '../../../assets/images/parking.svg';
import wifiIcon from '../../../assets/images/wifi.svg';
import mealsIcon from '../../../assets/images/meals.svg';
import securityIcon from '../../../assets/images/security.svg';

const Facilities = () => {
    return(
        <div className="section-facilities">
            <ul className="list-unstyled m-0">
                <li>
                    <img src={parkingIcon} alt="Parking" />
                    <span>Parking</span>
                </li>
                <li>
                    <img src={wifiIcon} alt="WIFI" />
                    <span>WIFI</span>
                </li>
                <li>
                    <img src={mealsIcon} alt="Meals" />
                    <span>Meals</span>
                </li>
                <li>
                    <img src={securityIcon} alt="24/7Security" />
                    <span>24/7Security</span>
                </li>
            </ul>
        </div>
    )
}

export default Facilities;