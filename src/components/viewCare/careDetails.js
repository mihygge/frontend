import React from 'react';
import capitalize from 'capitalize';
import Wishlist from '../customer/wishlist/wishlist';
import SocialNetwork from '../customer/socialNetwork';

const CareDetails = ({ care_detail, services_categorised, wishlisted, careId, userRole }) => {
    let careProvided = [];
    services_categorised.forEach((service_category, index) => {
        if(Object.keys(service_category)[0] === "Care Provided"){
            careProvided =  Object.values(service_category)[0]
        }
    })

    return(
        <div className="section-title-info">
            <div className="title-and-social">
                {
                    care_detail &&
                    <h1>{care_detail.name}<span>{care_detail.category.split('_').join(' ')}</span></h1>
                }
                {
                    userRole !== 'provider' &&
                        <div className="socail-buttons">
                            <SocialNetwork careId={careId}  
                                           mobile={care_detail.provider_mobile} 
                                           fb={care_detail.provider_fb}
                            />
                            <Wishlist wishlisted={wishlisted} careId={careId}/>
                        </div>
                }    
            </div>
            <div className="labels">
                {
                    careProvided &&
                    careProvided.map((service, index) => (
                        <span key={index}>{service}</span>
                    ))
                }
            </div>
            <div className="address-info">
                <span>
                {
                    `${care_detail?.city ? `${capitalize.words(care_detail?.city)},` : ''}
                    ${capitalize.words(care_detail?.county)}`
                }
                </span> 
                {
                    care_detail.approx_distance!==0 &&
                    <span>{care_detail.approx_distance} miles from city centre</span>
                }
                {
                    care_detail.map_url &&
                    <a href={care_detail.map_url} target="_blank" rel="noopener noreferrer">Locate on map</a>
                }
            </div>
        </div>
    )
}

export default CareDetails;