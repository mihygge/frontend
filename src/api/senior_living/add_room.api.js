import axiosInstance from '../'
const AddRoomApi = (values) => {
    const request_body = values
    return axiosInstance().post('/rooms', request_body)
}

export default AddRoomApi