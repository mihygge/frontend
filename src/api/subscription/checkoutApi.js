import axiosInstance from '..'

const subscriptionCheckout = () => {
    return axiosInstance().get('/billings/subscription_checkout')
}

export default subscriptionCheckout;