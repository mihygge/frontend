import axiosInstance from '../';

const confirmBookingApi = (bookingId, source, type) => {
   return axiosInstance().post(`/bookings/${bookingId}/payment`, { booking: { source: source, type: type }});
}

export default confirmBookingApi;