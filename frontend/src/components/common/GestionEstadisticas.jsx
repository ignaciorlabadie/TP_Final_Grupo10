import React, { useState, useEffect } from 'react';
import { estadisticasService } from '../../services/estadisticasService';
import '../../styles/components/gestionEstadisticas.css';

export const GestionEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState('');

  const cargarEstadisticas = async () => {
    try {
      const datos = await estadisticasService.getEstadisticas();
      setEstadisticas(datos);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  return (
    <div className="gestion-container">
      <h2>Estadísticas de Entrenamientos</h2>
      {error && <p className="error-mensaje">{error}</p>}

      {!estadisticas ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <>
          <div className="estadisticas-grid">
            <div className="estadistica-card">
              <h4>Total de entrenamientos</h4>
              <p>{estadisticas.total_entrenamientos ?? 0}</p>
            </div>
            <div className="estadistica-card">
              <h4>Tiempo total (min)</h4>
              <p>{estadisticas.tiempo_total_minutos ?? 0}</p>
            </div>
            <div className="estadistica-card">
              <h4>Promedio duración (min)</h4>
              <p>{estadisticas.promedio_duracion_minutos ?? 0}</p>
            </div>
            <div className="estadistica-card">
              <h4>Ejercicio más frecuente</h4>
              <p>{estadisticas.ejercicio_mas_frecuente?.nombre || '-'}</p>
              {estadisticas.ejercicio_mas_frecuente?.count != null && (
                <span>{estadisticas.ejercicio_mas_frecuente.count} veces</span>
              )}
            </div>
          </div>

          <h3>Entrenamientos por mes</h3>
          <div className="table-container">
            <table className="tabla-ejercicios">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Total</th>
                  <th>Tiempo total (min)</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.entrenamientos_por_mes && estadisticas.entrenamientos_por_mes.length > 0 ? (
                  estadisticas.entrenamientos_por_mes.map((mes) => (
                    <tr key={mes.mes}>
                      <td>{mes.mes}</td>
                      <td>{mes.total}</td>
                      <td>{mes.tiempo_total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="tabla-no-data">
                      No hay datos por mes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
