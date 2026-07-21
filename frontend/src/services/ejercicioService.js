const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const ejercicioService = {
  getAll: async () => {
    const respuesta = await fetch(`${API_URL}/ejercicios`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || 'Error al obtener los ejercicios');
    }

    return datos;
  },

  getById: async (id) => {
    const respuesta = await fetch(`${API_URL}/ejercicios/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || 'Error al obtener el ejercicio');
    }

    return datos;
  },

  create: async ({ nombre, tipo }) => {
    const respuesta = await fetch(`${API_URL}/ejercicios`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nombre, tipo }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.errors?.[0] || datos.msg || 'Error al crear el ejercicio');
    }

    return datos;
  },

  update: async (id, { nombre, tipo }) => {
    const respuesta = await fetch(`${API_URL}/ejercicios/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ nombre, tipo }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.errors?.[0] || datos.msg || 'Error al actualizar el ejercicio');
    }

    return datos;
  },

  delete: async (id) => {
    const respuesta = await fetch(`${API_URL}/ejercicios/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.errors?.[0] || datos.msg || 'Error al eliminar el ejercicio');
    }

    return datos;
  },

  getCount: async () => {
    const respuesta = await fetch(`${API_URL}/ejercicios/count`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || 'Error al obtener el conteo');
    }

    return datos;
  },

  getByTipo: async (tipo) => {
    const respuesta = await fetch(`${API_URL}/ejercicios/tipo/${tipo}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || 'Error al filtrar ejercicios');
    }

    return datos;
  },

  getProgreso: async (id) => {
    const respuesta = await fetch(`${API_URL}/ejercicios/${id}/progreso`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.msg || 'Error al obtener el progreso');
    }

    return datos;
  },
};
