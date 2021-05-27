import axiosInstance from '../'
const Register = (values) => {
    console.debug(values)
    let data = {
        "user": values
    }
    return new Promise((resolve, reject) =>{
        axiosInstance().post('/users', data).then((res) => {
            resolve(res)
        })
        .catch((err) => {
            resolve({
                failed: true,
                errors: err.response.data
            })
        })
    })
   
}

export default Register