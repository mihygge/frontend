import axiosInstance from '..';

const updateBookingApi = (bookingId, data) => {
    return axiosInstance()({
        url: `/bookings/${bookingId}`,
        method: 'PUT',
        data,
    });
};

export default updateBookingApi;
