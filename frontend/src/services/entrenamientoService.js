const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const entrenamientoService = {
    getAll: async () => {
        const respuesta = await fetch(`${API_URL}/entrenamientos`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.msg || 'Error al obtener entrenamientos');
        return datos;
    },

    getById: async (id) => {
        const respuesta = await fetch(`${API_URL}/entrenamientos/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.msg || 'Error al obtener el entrenamiento');
        return datos;
    },

    create: async (entrenamiento) => {
        const respuesta = await fetch(`${API_URL}/entrenamientos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(entrenamiento),
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.errors?.[0] || datos.msg || 'Error al crear entrenamiento');
        return datos;
    },
    delete: async (id) => {
    const respuesta = await fetch(`${API_URL}/entrenamientos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.errors?.[0] || datos.msg || 'Error al borrar entrenamiento');
        return datos;
    },
};