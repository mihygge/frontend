import axiosInstance from '../'
const AddLicense = (values) => {
    const request_body = values
    return axiosInstance().post('/assets', request_body)
}

export default AddLicense