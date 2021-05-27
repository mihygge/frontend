import React, { useState, useEffect } from 'react';
import DetailsCard from './detailsCard';
import './_whishlist.scss';
import Wishlisting from '../../../api/customer/wishlist-listing';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import cogoToast from 'cogo-toast';

const WhishList = () => {
    const [cares, setCares] = useState([])
    const [userDetails] = useLocalStorage('userDetails', {});
    const [isLoading, setIsLoading] = useState(true);

    const getWishlists = () => {
        setIsLoading(true);
        Wishlisting(userDetails.id)
            .then((res) => {
                setCares(res.data.data)
                setIsLoading(false);
            })
            .catch(err => cogoToast.error("Unable to fetch. Please try later"))
    }

    useEffect(() => {
        getWishlists();
    }, [])

    return (
            <div className="container-whishlist section-home-details">
                {
                    isLoading || cares.length === 0 ? (
                        <div className="section-cards-care section-no-care-message">
                            <span>{isLoading ? 'Loading...' : 'Wishlist is empty'}</span>
                        </div>
                    ) : (
                        cares?.length>0 &&
                        cares.map((care, index) => (
                            <DetailsCard key={index} care={care} listFn={getWishlists} />
                        ))
                    )
                }
            </div>
    )
}

export default WhishList;