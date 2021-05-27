import axiosInstance from '../'

const destroySession = () => {
    return axiosInstance().delete('/sessions/destroy')
}

export default destroySession