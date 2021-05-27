import React from 'react';
import parkingIcon from '../../assets/images/parking.svg';
import wifiIcon from '../../assets/images/wifi.svg';
import mealsIcon from '../../assets/images/meals.svg';
import securityIcon from '../../assets/images/security.svg';
import parkingActiveIcon from '../../assets/images/parking-active.svg';
import wifiActiveIcon from '../../assets/images/wifi-active.svg';
import mealsActiveIcon from '../../assets/images/meals-active.svg';
import securityActiveIcon from '../../assets/images/security-active.svg';

const Facilities = ({ availableFacilities }) => {
    const { parking, wifi, meals, security } = availableFacilities;
    return(
        <div className="section-facilities">
            <ul className="list-unstyled m-0">
                <li className={parking ? "available" : ''}>
                    <img src={parking ? parkingActiveIcon : parkingIcon} alt="Parking" />
                    <span>Parking</span>
                </li>
                <li className={wifi ? "available" : ''}>
                    <img src={ wifi? wifiActiveIcon : wifiIcon} alt="WIFI" />
                    <span>WIFI</span>
                </li>
                <li className={meals ? "available" : ''}>
                    <img src={ meals ? mealsActiveIcon : mealsIcon} alt="Meals" />
                    <span>Meals</span>
                </li>
                <li className={security ? "available" : ''}>
                    <img src={security ? securityActiveIcon : securityIcon} alt="24/7Security" />
                    <span>24/7Security</span>
                </li>
            </ul>
        </div>
    )
}

export default Facilities;