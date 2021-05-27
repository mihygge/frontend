import axiosInstance from '..'

const removeCard = (id) => {
    return axiosInstance().delete(`/cards/${id}`)
}

export default removeCard;