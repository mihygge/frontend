import axiosInstance from '..'

const listCards = (userId) => {
    return axiosInstance().get(`/billings/retrieve_card_detail`)
}

export default listCards;