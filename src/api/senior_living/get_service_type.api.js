import axiosInstance from '..'
const GetServiceType = (type) => {
    return axiosInstance().get(`/service_types?care_type=${type}`)
}

export default GetServiceType