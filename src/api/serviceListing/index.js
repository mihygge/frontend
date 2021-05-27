import axiosInstance from '..'

export const careListApi = (careType, userId, currentPage) => {
    return axiosInstance()({
        method: 'GET',
        url: `/users/${userId}/cares?category=${careType}&page=${currentPage}`,
    })
}