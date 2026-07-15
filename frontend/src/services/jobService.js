import API from './axiosConfig'

export const jobService = {
    getAll: (params) => API.get('/jobs', { params }),
    getMy: () => API.get('/jobs/my'),
    getById: (id) => API.get(`/jobs/${id}`),
    create: (data) => API.post('/jobs', data),
    update: (id, data) => API.put(`/jobs/${id}`, data),
    remove: (id) => API.delete(`/jobs/${id}`),
}

export const applicationService = {
    apply: (formData) => API.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getMy: () => API.get('/applications/my'),
    getByJob: (jobId, params) => API.get(`/applications/job/${jobId}`, { params }),
    updateStatus: (id, status) => API.put(`/applications/${id}/status`, { status }),
    scoreCV: (appId) => API.post('/ai/score-cv', { application_id: appId }),
}