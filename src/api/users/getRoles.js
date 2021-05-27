import axiosInstance from '../'

const getRoles = () => {
    return axiosInstance().get('/roles')
}

export default getRoles