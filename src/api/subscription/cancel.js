import axiosInstance from '..'

const cancelSub = (care_id) => {
    return axiosInstance().post(`/billings/cancel_subscription`, { care_id: care_id })
}

export default cancelSub