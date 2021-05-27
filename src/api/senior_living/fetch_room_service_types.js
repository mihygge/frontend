import axiosInstance from '../'
const FetchRoomServiceType = (values) => {
    const request_body = values
    return axiosInstance().get('/room_service_types', request_body)
}

export default FetchRoomServiceType