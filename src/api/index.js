import axios from 'axios'
import cogoToast from 'cogo-toast'

const errorComposer = (error) => {
    return () => {
        const statusCode = error.response ? error.response.status : null;
        if (statusCode === 404) {
            cogoToast.error('The requested resource does not exist or has been deleted')
        }
            
        if(statusCode === 500){
            cogoToast.error('Request to server, please try again or connect to site admin.')
        }
        
        if (statusCode === 401) {
            cogoToast.error('Session ended, logging out automatically')
            localStorage.clear()
            setTimeout(() => {
                window.location.reload()
            }, 5000)
        }
    }
}

const axiosApi = () => {
    const auth_token = JSON.parse(localStorage.getItem('login_token'))
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: { 'Content-Type': 'application/json' },
    })
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;
    axiosInstance.interceptors.response.use(undefined, function (error) {
        error.handleGlobally = errorComposer(error);
    
        return Promise.reject(error);
    })
    
    return axiosInstance
}

export default axiosApi;