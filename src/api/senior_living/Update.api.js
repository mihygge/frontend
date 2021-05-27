import axiosInstance from '../'
const UpdateCare = (care_id, request_body) => {
    return axiosInstance().put(`/cares/${care_id}`, request_body)
}

export default UpdateCare