import axiosInstance from '../'
const Login = (values) => {
    return new Promise((resolve, reject) =>{
        axiosInstance().post('/users/login', values).then((res) => {
            resolve(res)
        })
        .catch((err) => {
            resolve({
                failed: true,
                errors: err.response.data,
                status: err.response.status
            })
        })
    })
}

export default Login