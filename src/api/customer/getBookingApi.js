import axiosInstance from '../';

const getBookingApi = (bookingId) => {
   return axiosInstance().get(`/bookings/${bookingId}`);
}

export default getBookingApi;