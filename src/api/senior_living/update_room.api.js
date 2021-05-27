import axiosInstance from '../'
const UpdateRoomApi = (roomId, values) => {
    const request_body = values;
    return axiosInstance().put(`/rooms/${roomId}`, request_body);
}

export default UpdateRoomApi;