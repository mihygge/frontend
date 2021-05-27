import React from 'react'
import { Link } from 'react-router-dom';
import nextIcon from '../../../../assets/images/arrow-right.svg';

const SectionTitle = (props) => {
    const { handleSubmitMyForm, title, activeTab } = props
    return(
        <React.Fragment>
            <div className="section-title section-title-secondary">
                <h2 className="title">{title}</h2>
                <div className="prev-next-buttons">
                    {/* <Link to="^_^" className="btn-theme btn-transparent btn-prev"><img src={prevIcon}  alt="Prev"/></Link> */}
                    <Link to="#" className={`btn-theme btn-transparent btn-next ${!props.enabled_save_button? "disabled": ""}`} onClick={handleSubmitMyForm}>
                        { activeTab === '6' ? 'Confirm & Submit' :  'Save & Continue next' }
                        <img src={nextIcon} alt="Next" />
                    </Link>
                </div>
            </div>
        </React.Fragment>
        
    )
}

export default SectionTitle