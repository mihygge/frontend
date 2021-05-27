import axiosInstance from '..'

export const newsLetterApi = (values) => {
    const data = {
        "email": values.email,
    }
    return axiosInstance()({
        method: 'POST',
        url: '/newsletters',
        data,
    })
}