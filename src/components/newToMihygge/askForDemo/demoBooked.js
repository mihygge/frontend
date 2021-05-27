import React from 'react';
import CheckMark from '../../../assets/images/check-green.svg';

const DemoBooked = () => {
    return (
        <div className="form-container-demo demo-booked-message-container">
            <div className="message-body">
                <img src={CheckMark} alt="Success Check Mark"/>
                <h2>Your Demo Booked!</h2>
                <p>Hey, Your demo has been successfully booked! The details along with scheduled time and date has been sent via email provided. Please keep your notifications on for demo.</p>
            </div>
        </div>
    );
};

export default DemoBooked;