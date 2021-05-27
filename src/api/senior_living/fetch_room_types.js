import axiosInstance from '../'
const FetchRoomType = (values) => {
    const request_body = values
    return axiosInstance().get('/room_types', request_body)
}

export default FetchRoomType