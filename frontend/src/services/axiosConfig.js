import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
})

// Gắn JWT token tự động vào mọi request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('recruit_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Tự động logout khi token hết hạn (401)
API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('recruit_token')
            localStorage.removeItem('recruit_user')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export default API