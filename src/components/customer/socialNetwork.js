import React, { useState } from 'react';
import MessengerIcon from '../../assets/images/messenger.svg';
import WhatsappIcon from '../../assets/images/whatsappIcon.svg';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast';

const SocialNetwork = ({ careId, mobile, fb }) => {
    const [txt, _] = useState(process.env.REACT_APP_URL + `/care/${careId}`);
    
    const shareWhatsapp = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(txt).then(() => {
            if(mobile === '') {
                cogoToast.info("Provider contact information not present. Link copied to clipboard.")
            } else {
                cogoToast.loading("sharing...")
                window.open(`https://wa.me/${mobile}`)
            }
        }).catch(() => console.log("Unable to copy"));
        
    }

    const shareFb = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(txt).then(() => {
            if(fb === '') {
                cogoToast.info("Provider contact information not present. Link copied to clipboard.")
            } else {
                cogoToast.loading("sharing...")
                window.open(`https://m.me/${fb}`);
            }
        }).catch(() => console.log("Unable to copy"))
        
    }

    return (
        <div className="social-icons">
            <a className="btn-theme btn-no-box"><img src={WhatsappIcon} alt="Whatsapp Icon" onClick={shareWhatsapp}/></a>
            <a className="btn-theme btn-no-box"><img src={MessengerIcon} alt="Messenger Icon" onClick={shareFb}/></a>
        </div>
    )
}

export default withRouter(SocialNetwork);