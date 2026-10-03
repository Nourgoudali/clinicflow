import api from './api';

export const patientService = {
  getPatients: async ({ search = '', page = 1, limit = 10 } = {}) => {
    const params = { page, limit };
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    const response = await api.get('/patients', { params });
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  createPatient: async (data) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  updatePatient: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};
