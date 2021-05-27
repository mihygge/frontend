import axiosInstance from '../'
const ProfileLicense = (values) => {
    const request_body = values
    return axiosInstance().post('/cares', request_body)
}

export default ProfileLicense