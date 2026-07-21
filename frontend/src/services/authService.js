const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const authService = {
  register: async (nombre, email, password) => {
    const respuesta = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || 'Error al registrar el usuario');
    }

    return datos;
  },

  login: async (email, password) => {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || 'Error al iniciar sesión');
    }

    return datos;
  },

  getPerfil: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No estás autorizado. Por favor, iniciá sesión.');
    }

    const respuesta = await fetch(`${API_URL}/auth/perfil`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || 'Error al obtener el perfil');
    }

    return datos;
  },

  getAllUsers: async () => {
    const respuesta = await fetch(`${API_URL}/auth/usuarios`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || 'Error al obtener la lista de usuarios');
    }

    return datos;
  },
};
