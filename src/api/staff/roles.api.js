import axiosInstance from '../'

const getRoles = () => {
    return axiosInstance().get('/staff_roles')
}

export default getRoles