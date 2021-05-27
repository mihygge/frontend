import axiosInstance from '../'
export const GetApi = (url) => {
    return axiosInstance().get(url)
}