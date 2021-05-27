import axiosInstance from '../'

const showUser = (userId) => {
    return axiosInstance().get(`/users/${userId}`);
}

export default showUser;