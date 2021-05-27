import React from 'react'
import Header from '../commons/header';
import Footer from '../commons/footer';

import { Link } from 'react-router-dom'
const Thankyou = () => (
    <div className="wrapper-thank-you">
        <Header />
        <div className="custom-container-mini">
            <div className="content-thank-you">
                <h1>Thank You!</h1>
                <p className="lead">Your account has been successfully verified. <br />Please sign-in to proceed.</p>
                <Link to="/" className="btn-theme">Continue to homepage</Link>
            </div>
        </div>
        <Footer />
    </div>
)

export default Thankyou