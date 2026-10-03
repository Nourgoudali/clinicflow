import api from './api';

export const appointmentService = {
  getAppointments: async ({ date, status, patientId, page, limit } = {}) => {
    const params = {};
    if (date) params.date = date;
    if (status) params.status = status;
    if (patientId) params.patientId = patientId;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  updateAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};
