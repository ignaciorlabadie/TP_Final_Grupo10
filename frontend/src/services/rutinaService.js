import api from './api';

export const listarRutinas = () => api.get('/rutinas');

export const getRutina = (id) => api.get(`/rutinas/${id}`);

export const crearRutina = (data) => api.post('/rutinas', data);

export const actualizarRutina = (id, data) => api.put(`/rutinas/${id}`, data);

export const eliminarRutina = (id) => api.delete(`/rutinas/${id}`);
