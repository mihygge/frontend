import axiosInstance from '..'

const subscribeCare = (card, token) => {
    let payload;
    
    if(token) {
        payload = {
            card_token: token
        }
    } else {
        payload = {
            card_id: card
        }
    }
        

    return axiosInstance().post('/billings/subscribe', payload)
}

export default subscribeCare;