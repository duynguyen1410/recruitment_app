import API from './axiosConfig'

export const authService = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    me: () => API.get('/auth/me'),
}