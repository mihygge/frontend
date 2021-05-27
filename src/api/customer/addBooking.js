import axiosInstance from '../';

export const addBookingApi = (params) => {
    return axiosInstance().post('/bookings', params);
}