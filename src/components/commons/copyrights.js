import React from 'react';
import QuestionMark from '../../assets/images/question.svg';
// import Faq from '../../assets/documents/faq.pdf';

const Copyrights = () => {
    
    return(
        <footer className="wrapper-copyrights">
            <div className="custom-container">
                <div className="section-copyrights">
                    <div className="section-right">
                        {/* <a href={Faq} className="btn-theme btn-no-box" target="_blank"><img src={QuestionMark} alt="Question mark"/>How can we help ?</a> */}
                        <p>&copy; Copyright 2021 HYGGE AIM, Inc dba miHygge</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Copyrights;