import axiosInstance from '..'

export const viewRoomApi = (roomId) => {
    return axiosInstance()({
        method: 'GET',
        url: `rooms/${roomId}/view_room`,
    })
}

export const viewAvailableBedsApi = (params) => {
    return axiosInstance().get('rooms/view_filtered_bed', {params: params});
 }