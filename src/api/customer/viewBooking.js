import axiosInstance from '../';

const viewBookingsApi = (userId, params) => {
    return axiosInstance()({
        method: 'GET',
        params,
        url: `/users/${userId}/bookings`,
    });
};

export default viewBookingsApi;
