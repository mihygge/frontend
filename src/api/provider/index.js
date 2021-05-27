import updateBookingApi from './updateBooking';

export { default as viewBookingsApi } from './viewBookings';

export const bookingDocsReceivedApi = (bookingId) => {
    return updateBookingApi(bookingId, { doc_received: true });
};

export const bookingStatusUpdateApi = (bookingId, status) => {
    return updateBookingApi(bookingId, { status });
};
