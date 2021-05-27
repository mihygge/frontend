import axiosInstance from '..'

const cards = () => {
    return axiosInstance().get('/billings/retrieve_card_detail')
}

export default cards;