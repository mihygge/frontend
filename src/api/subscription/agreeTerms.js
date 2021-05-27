import axiosInstance from '..'

const termsAndConditions = () => {
    return axiosInstance().post('/documents/signing')
}

export default termsAndConditions