import API from './axiosConfig'

export const scoreCVApi = (application_id) =>
    API.post('/ai/score-cv', { application_id })

export const generateJDApi = (data) =>
    API.post('/ai/generate-jd', data)

export const interviewQuestionsApi = (data) =>
    API.post('/ai/interview-questions', data)

export const chatApi = (message) =>
    API.post('/ai/chat', { message })

export const adminStatsApi = () =>
    API.get('/admin/stats')

export const adminUsersApi = () =>
    API.get('/admin/users')

export const adminDeleteUserApi = (id) =>
    API.delete(`/admin/users/${id}`)