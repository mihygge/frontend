import axiosInstance from '..'

const getAllPlans = () => {
    return axiosInstance().get('/billings/subscriptions_plan')
}

export default getAllPlans