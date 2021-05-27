import axiosInstance from '..'

const docuSignCallback = () => {
    return axiosInstance().get('/documents/ds_return')
}

export default docuSignCallback;