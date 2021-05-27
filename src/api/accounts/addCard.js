import axiosInstance from '..'

const addCard = (token) => {
    return axiosInstance().get(`/billings/create_card_token`, { 
        params: {
            card_token: token
        } 
    })
}

export default addCard;