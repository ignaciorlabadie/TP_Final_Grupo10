const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const rutinaService = {
  getAll: async () => {
    const respuesta = await fetch(`${API_URL}/rutinas`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.msg || 'Error al obtener rutinas');
    return datos;
  },

  create: async (rutina) => {
    const respuesta = await fetch(`${API_URL}/rutinas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(rutina),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.errors?.[0] || datos.msg || 'Error al crear rutina');
    return datos;
  },

  update: async (id, rutina) => {
    const respuesta = await fetch(`${API_URL}/rutinas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(rutina),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.errors?.[0] || datos.msg || 'Error al actualizar rutina');
    return datos;
  },

  delete: async (id) => {
    const respuesta = await fetch(`${API_URL}/rutinas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.errors?.[0] || datos.msg || 'Error al borrar rutina');
    return datos;
  },
};