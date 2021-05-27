import React from 'react';
import Values from '../components/commons/values';
import Banner from '../components/home/banner';
import Footer from '../components/commons/footer';
import Empowerment from '../components/home/empowerment';
import HeaderWithUser from '../components/commons/headerWithUserLogin';
import "../global.scss";

const CustomerLandingLayout = ({ children, ...rest })=>(
    <div className="App">
        <HeaderWithUser />
        <Banner isAuthenticated={true}></Banner>
        <Empowerment />
        <Values />
        <Footer />
    </div>
)

export default CustomerLandingLayout