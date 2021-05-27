import axiosInstance from '../';

const addToWishlist = (userId, careId) => {
   return axiosInstance().post(`/users/${userId}/add_to_wishlist`, { care_id: careId });
}

export default addToWishlist;
