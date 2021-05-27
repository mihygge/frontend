import axiosInstance from '../';

const filterRoomsApi = (params) => {
   return axiosInstance().get('/rooms/view_filtered_room', {params: params});
}

export default filterRoomsApi;
