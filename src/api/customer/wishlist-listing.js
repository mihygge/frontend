import axiosInstance from '../';

const Wishlisting = (userId) => {
   return axiosInstance().get(`/users/${userId}/wishlists`);
}

export default Wishlisting;