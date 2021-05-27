import axiosInstance from '../'

export const forgotPasswordApi = (values) => {
    const data = {
        "email": values.email,
    }
    return axiosInstance()({
        method: 'POST',
        url: '/passwords',
        data,
    })
}

export const resetPasswordApi = (values, token) => {
    const data = {
        "token": token,
        "user": values,
    }
    return axiosInstance()({
        method: 'PUT',
        url: `/passwords/${token}`,
        data,
    })
}

export const changePasswordApi = (values, userId) => {
    const data = {
        "user": values,
    }
    return axiosInstance()({
        method: 'PUT',
        url: `/users/${userId}/change_password`,
        data,
    })
}

