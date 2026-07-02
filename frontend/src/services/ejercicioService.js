import api from './api';

export const listarEjercicios = () => api.get('/ejercicios');

export const getEjercicio = (id) => api.get(`/ejercicios/${id}`);

export const getEjerciciosCount = () => api.get('/ejercicios/count');

export const getEjerciciosByTipo = (tipo) => api.get(`/ejercicios/tipo/${tipo}`);

export const getProgresoEjercicio = (id) => api.get(`/ejercicios/${id}/progreso`);

export const crearEjercicio = (data) => api.post('/ejercicios', data);

export const actualizarEjercicio = (id, data) => api.put(`/ejercicios/${id}`, data);

export const eliminarEjercicio = (id) => api.delete(`/ejercicios/${id}`);
