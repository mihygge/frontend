import axiosInstance from '../';

const removeWishlist = (userId, careId) => {
   return axiosInstance().delete(`/users/${userId}/remove_wishlist?care_id=${careId}`);
}

export default removeWishlist;
