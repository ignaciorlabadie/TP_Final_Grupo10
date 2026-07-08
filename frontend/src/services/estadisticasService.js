const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const estadisticasService = {
  getEstadisticas: async () => {
    const respuesta = await fetch(`${API_URL}/estadisticas`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.error || datos.msg || 'Error al obtener estadísticas');
    }

    return datos;
  },
};
