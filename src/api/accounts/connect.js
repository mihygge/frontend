import axiosInstance from '..'

const connect = (userId) => {
    return axiosInstance().get(`/users/${userId}/account_url`)
}

export default connect;