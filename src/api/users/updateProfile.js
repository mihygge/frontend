import axiosInstance from '../'

export const getUserProfileApi = (userId) => {
    return axiosInstance()({
        method: 'GET',
        url: `/users/${userId}`,
    })
}

export const updateProfileApi = (values, userId) => {
    const data = {
        "user": values,
    }
    return axiosInstance()({
        method: 'PUT',
        url: `/users/${userId}`,
        data,
    })
}

