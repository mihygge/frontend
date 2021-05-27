import axiosInstance from '..'

const getSuggestedPlans = () => {
    return axiosInstance().get('/billings/view_subscription')
}

export default getSuggestedPlans