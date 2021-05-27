import axiosInstance from '../'
const UpdateStaffDetails = (care_id, request_body) => {
    return axiosInstance().put(`/cares/${care_id}`, request_body)
}

export default UpdateStaffDetails