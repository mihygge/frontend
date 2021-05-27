import React, { useState } from 'react';
import Header from '../../commons/header';
import Footer from '../../commons/footer';
import FormDemo  from './formDemo';
import DemoBooked from './demoBooked';
import HeaderWithUser from '../../commons/headerWithUserLogin';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';

const AskForDemo = () => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [userDetail] = useLocalStorage('userDetails', {});
    const userRole = userDetail.role;
    
    return (
        <div className="wrapper-ask-for-demo">
            {
	            !!userRole ? <HeaderWithUser /> : <Header />
            }
            <div className="wrapper-banner-customer wrapper-banner-demo">
                <div className="custom-container">
                    <div className="banner-customer banner-demo">
                        <h1 className="title-page">Ask For Demo</h1>
                    </div>
                </div>
            </div>
            <div className="wrapper-main-content">
                {
                    !formSubmitted ?
                    <FormDemo 
                        setFormSubmitted={setFormSubmitted}
                    />
                    : <DemoBooked />
                }
            </div>
            <Footer />
        </div>
    );
};

export default AskForDemo;