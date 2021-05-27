import axiosInstance from '../';

export const relationshipsForBookingListApi = () => {
    return axiosInstance().get('relationships');
}