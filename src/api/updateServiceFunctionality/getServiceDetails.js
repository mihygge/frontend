import axiosInstance from '..'

export const getServiceDetailsApi = (serviceId, detailType) => {
    return axiosInstance()({
        method: 'GET',
        url: `/cares/${serviceId}/?type=${detailType}`,
    })
}