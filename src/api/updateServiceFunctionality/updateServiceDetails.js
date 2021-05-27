import axiosInstance from '..'

export const updateProfileAndLicenseDetailsApi = (serviceId, data) => {
    return axiosInstance()({
        method: 'PUT',
        url: `/cares/${serviceId}`,
        data,
    })
}

export const deleteAssetApi = (serviceId) => {
    return axiosInstance()({
        method: 'DELETE',
        url: `assets/${serviceId}`
    })
}

export const updateImageOrderApi = () => {
    
}
