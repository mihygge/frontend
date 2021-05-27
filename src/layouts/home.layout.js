import React, { useState, useEffect} from 'react';
import Header from '../components/commons/header';
import Values from '../components/commons/values/';
import Banner from '../components/home/banner/';
import Footer from '../components/commons/footer';
import Empowerment from '../components/home/empowerment/';
import NewsLetterPopUp from '../modals/newsLetterModal';
import "../global.scss";
import useLocalStorage from '../effects/LocalStorage/use-local-storage';
import _ from 'lodash'; 

const HomeLayout = ({ children, ...rest })=>{
    const [newsLetterPopUp, setconfirmationModal] = useState(false);
    const toggleConfirmationModal = () => setconfirmationModal(!newsLetterPopUp);

    const [userDetails] = useLocalStorage('userDetails', {});
    useEffect(() => {
        if(_.isEmpty(userDetails)){
            setconfirmationModal(true);
        }
    }, [])

    return(
    <div className="App">
        <Header></Header>
        <Banner></Banner>
        <Empowerment />
        <Values />
        <Footer></Footer>
        <NewsLetterPopUp toggle={toggleConfirmationModal} isOpen={newsLetterPopUp} />
    </div>
)}

export default HomeLayout