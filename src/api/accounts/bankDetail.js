import axiosInstance from '..'

const addBankDetail = (values) => {
    return axiosInstance().post('/billings/add_bank_details',{ "billing" : values })
}

export default addBankDetail;