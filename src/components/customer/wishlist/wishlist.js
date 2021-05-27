import React, { Component, useState } from 'react';
import addToWishlist from '../../../api/customer/addToWishlist';
import removeWishlist from '../../../api/customer/removeFromWishlist';
import cogoToast from 'cogo-toast';
import addIcon from '../../../assets/images/icon-add.svg';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';

const Wishlist = (props) => {
    const { careId, wishlisted, fromPath, wishlisting } = props;
    const [wishlistState, setWishlistState] = useState(wishlisted);
    const [userDetails] = useLocalStorage('userDetails', {});
    const userId = userDetails.id;

    const removeFromWishlist = () => {
        removeWishlist(userId, careId)
            .then(() => {
                if(fromPath === 'wishlist-page') {
                    wishlisting();
                } else {
                    setWishlistState(false);
                    cogoToast.success("Removed from wishlist")
                }
                
            })
            .catch(() => cogoToast.error("Unable to remove from wishlist"))
    }

    const saveToWishlist = () => {
        addToWishlist(userId, careId)
            .then(() => {
                setWishlistState(true);
                cogoToast.success("Added to your wishlist")
            })
            .catch(() => cogoToast.error("Unable to add to your wishlist"))
    }

    return(
        <div> 
            { 
                wishlistState === false &&
                    <button className="btn-theme btn-transparent btn-black btn-add btn-remove-add" 
                        onClick={() => saveToWishlist()}>
                        <img src={addIcon} />
                        Add
                    </button>
            }
            
            { 
                wishlistState &&
                    <button className="btn-theme btn-transparent btn-black btn-add btn-remove-add" 
                        onClick={() => removeFromWishlist()}>
                        <img src={addIcon} />
                        Remove
                    </button>
            }
        </div>
       
    )
}

export default Wishlist;