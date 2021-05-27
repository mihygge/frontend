import React, { useState } from 'react';
import Facilities from '../../common/facilities';
import { Link } from 'react-router-dom';
import capitalize from 'capitalize';
import LoginContainer from '../../../../containers/Login.container';
import useLocalStorage from '../../../../effects/LocalStorage/use-local-storage';
import Wishlist from '../../wishlist/wishlist';

const DetailsCard = (props) => {
    const { careOrHomeDetails, formValues } = props;
    const { id, name, available_basic_facilities, address_details, licences, image_url, wishlisted } = careOrHomeDetails.attributes;
    
    const licenses = licences?.map(l => capitalize(l)).join(', ')

    const [userDetail] = useLocalStorage('userDetails', {});
    const isUserAuthenticated = Object.keys(userDetail).length>0;

    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

    const handleLoginModal = () => (setLoginModalIsOpen(!loginModalIsOpen))

    const handleViewDetail = () => {
        if(!isUserAuthenticated){
            handleLoginModal();
        }
    }

    // handle addToWishlist here

    return(
        <div className="room-details home-details">
            <div className="img-container">
                {
                    image_url ?
                    <img src={image_url} alt="Home" />
                    : <p>No Image Available</p>
                }
            </div>
            <div className="details-brief">
                <div>
                    <h2>{capitalize.words(name)}</h2>
                    {
                        address_details &&
                        <div className="room-type">
                            <span>
                                {
                                    `${address_details?.city ? `${capitalize.words(address_details?.city)},` : ''}
                                    ${capitalize.words(address_details?.county)},
                                    ${capitalize.words(address_details?.state)},
                                    ${capitalize.words(address_details?.country)}`
                                }
                            </span>
                            {
                                address_details?.approx_distance!==0 &&
                                <span>{address_details?.approx_distance} miles from city centre</span>
                            }
                            {
                                address_details?.map_url &&
                                <a href={address_details?.map_url} target="_blank" rel="noopener noreferrer">Locate on map</a>
                            }
                        </div>
                    }
                    {
                        available_basic_facilities &&
                        <Facilities
                            availableFacilities={available_basic_facilities}
                        />
                    }
                </div>
                {
                    !!licences?.length &&
                    <span className="detail-licence">{`License - ${licenses}`}</span>
                }
            </div>
            <div className="details-fee buttons-container">
                {
                    isUserAuthenticated ? 
                        <Wishlist careId={id} wishlisted={wishlisted} /> : <button className="btn-theme btn-transparent btn-black" onClick={handleViewDetail}>Add to Wishlist</button>
                }
                
                <Link
                    className="btn-theme"
                    onClick={handleViewDetail}
                    to={
                        isUserAuthenticated && {
                            pathname: `/care/${id}`,
                            state: formValues
                        }
                    }
                >
                    View Details
                </Link>
            </div>
            <LoginContainer 
                toggle = {handleLoginModal} 
                isOpen = {loginModalIsOpen}
            />
        </div>
    )
}

export default DetailsCard;