import axiosInstance from '..'

export const viewServiceApi = (serviceId) => {
    return axiosInstance()({
        method: 'GET',
        url: `cares/${serviceId}/view_care`,
    })
}