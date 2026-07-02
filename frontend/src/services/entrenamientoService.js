import api from './api';

export const listarEntrenamientos = () => api.get('/entrenamientos');

export const getEntrenamiento = (id) => api.get(`/entrenamientos/${id}`);

export const crearEntrenamiento = (data) => api.post('/entrenamientos', data);

export const eliminarEntrenamiento = (id) => api.delete(`/entrenamientos/${id}`);
