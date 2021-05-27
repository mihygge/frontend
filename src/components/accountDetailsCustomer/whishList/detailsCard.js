import React, { useState } from 'react';
import Facilities from '../../viewCare/facilities';
import { Link } from 'react-router-dom';
import ConfirmationPop from '../../../modals/confirmationPop';
import capitalize from 'capitalize';
import Wishlist from '../../customer/wishlist/wishlist';
import SocialNetwork from '../../customer/socialNetwork';

const DetailsCard = ({ care, listFn }) => {
    const [careDetail, _] = useState(care.attributes)
    const [confirmationModal, setconfirmationModal] = useState(false);
    const toggleConfirmationModal = () => setconfirmationModal(!confirmationModal);

    return(
        <div className="room-details home-details">
            <div className="details-left-section">
                <div className="img-container">
                    <img src={ careDetail.image_url } alt="Home" />
                    {/* <p>No Image Available</p> */}
                </div>
                <div className="details-brief">
                    <div>
                        <h2>{ careDetail.name }</h2>
                        <div className="room-type">
                            <span>{capitalize(careDetail.address_details.county) }</span>
                            {
                                careDetail.address_details.approx_distance !== 0 &&
                                <span>{careDetail.address_details.approx_distance} miles from city centre</span>
                            }
                            {
                                careDetail.address_details.map_url &&
                                <a href={careDetail.address_details.map_url} target="_blank" rel="noopener noreferrer">Locate on map</a>
                            }
                        </div>
                        <Facilities availableFacilities={careDetail.available_basic_facilities}/>
                    </div>
                    {
                        !!careDetail.licences?.length &&
                        <span className="detail-licence">{`License - ${careDetail.licences}`}</span>
                    }
                </div>
            </div>
            <div className="details-fee buttons-container">
                <SocialNetwork careId={care.id} 
                               mobile={careDetail.provider_mobile} 
                               fb={careDetail.provider_fb} 
                />
                <div className="buttons-actions">
                    <Wishlist careId={care.id} 
                        wishlisted={true} 
                        fromPath="wishlist-page" 
                        wishlisting={listFn}/>

                    <Link className="btn-theme" to={{ pathname: `/care/${care.id}`}}>View Details</Link>
                </div>
            </div>
            <ConfirmationPop toggle={toggleConfirmationModal} isOpen={confirmationModal} />
        </div>
    )
}

export default DetailsCard;