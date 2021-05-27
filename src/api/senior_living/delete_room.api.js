import axiosInstance from '..'

export const deleteRoomApi = (roomId) => {
    return axiosInstance()({
        method: 'DELETE',
        url: `/rooms/${roomId}`,
    })
}