import axiosInstance from '../';

export const askForDemoApi = (data) => {
    return axiosInstance()({
        method: 'POST',
        url: '/appointments/ask_for_demo',
        data
    })
}

