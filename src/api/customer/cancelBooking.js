import axiosInstance from '../';

const cancelBookingApi = (bookingId) => {
    return axiosInstance()({
        method: 'PUT',
        data: { status: 'cancelled' },
        url: `/bookings/${bookingId}`,
    });
};

export default cancelBookingApi;
