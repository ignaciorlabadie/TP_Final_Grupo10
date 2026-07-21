import React, { useState, useEffect } from 'react';
import { entrenamientoService } from '../../services/entrenamientoService';
import { rutinaService } from '../../services/rutinaService';
import '../../styles/components/gestionEntrenamientos.css';

export const GestionEntrenamientos = () => {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    rutina_id: '',
    fecha: '',
    duracion_real: '',
    notas: '',
  });
  const [errores, setErrores] = useState({});
  const [ejerciciosEntrenamiento, setEjerciciosEntrenamiento] = useState([]);

  const findRutinaNombre = (rutinaId) => {
    const rutina = rutinas.find((item) => item.id === rutinaId);
    return rutina ? rutina.nombre : rutinaId;
  };

  const cargarEntrenamientos = async () => {
    try {
      const datos = await entrenamientoService.getAll();
      setEntrenamientos(datos);
    } catch (err) {
      setError(err.message);
    }
  };

  const cargarRutinas = async () => {
    try {
      const datos = await rutinaService.getAll();
      setRutinas(datos);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      setLoading(true);
      await Promise.all([cargarEntrenamientos(), cargarRutinas()]);
      setLoading(false);
    };
    inicializar();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'rutina_id') {
      setForm({ ...form, rutina_id: value });
      const rutina = rutinas.find((r) => r.id === Number(value));
      if (rutina?.EjercicioModels) {
        setEjerciciosEntrenamiento(
          rutina.EjercicioModels.map((ej) => ({
            ejercicio_id: ej.id,
            nombre: ej.nombre,
            series_realizadas: ej.RutinaEjercicioModel?.series || 3,
            repeticiones_realizadas: ej.RutinaEjercicioModel?.repeticiones || 10,
            peso_usado: '',
          }))
        );
      } else {
        setEjerciciosEntrenamiento([]);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEjercicioChange = (index, field, value) => {
    const nuevos = [...ejerciciosEntrenamiento];
    nuevos[index][field] = value;
    setEjerciciosEntrenamiento(nuevos);
  };

  const validar = () => {
    const nuevos = {};
    if (!form.rutina_id) nuevos.rutina_id = 'Seleccioná una rutina';
    if (form.duracion_real && Number(form.duracion_real) < 0) nuevos.duracion = 'La duración no puede ser negativa';
    const pesoInvalido = ejerciciosEntrenamiento.some(
      (ej) => ej.peso_usado && Number(ej.peso_usado) < 0
    );
    if (pesoInvalido) nuevos.peso = 'El peso no puede ser negativo';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setError('');

    const payload = {
      rutina_id: Number(form.rutina_id),
      fecha: form.fecha || new Date(),
      duracion_real: form.duracion_real ? Number(form.duracion_real) : null,
      notas: form.notas,
      ejercicios: ejerciciosEntrenamiento.map((ej) => ({
        ejercicio_id: Number(ej.ejercicio_id),
        series_realizadas: Number(ej.series_realizadas),
        repeticiones_realizadas: Number(ej.repeticiones_realizadas),
        peso_usado: ej.peso_usado ? Number(ej.peso_usado) : null,
      })),
    };

    try {
      await entrenamientoService.create(payload);
      setForm({ rutina_id: '', fecha: '', duracion_real: '', notas: '' });
      setEjerciciosEntrenamiento([]);
      setErrores({});
      cargarEntrenamientos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Seguro que querés eliminar el entrenamiento ${id}?`)) {
      try {
        await entrenamientoService.delete(id);
        cargarEntrenamientos();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="gestion-container">
        <h2>Gestión de Entrenamientos</h2>
        <p>Cargando entrenamientos...</p>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <h2>Gestión de Entrenamientos</h2>
      {error && <p className="error-mensaje">{error}</p>}

      <form onSubmit={handleSubmit} className="gestion-form">
        <h3>Registrar Nuevo Entrenamiento</h3>
        <div className="form-grid">
          <label>
            Rutina
            <select
              name="rutina_id"
              value={form.rutina_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar rutina</option>
              {rutinas.map((rutina) => (
                <option key={rutina.id} value={rutina.id}>
                  {rutina.nombre}
                </option>
              ))}
            </select>
            {errores.rutina_id && <span className="error-campo">{errores.rutina_id}</span>}
          </label>

          <label>
            Fecha
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />
          </label>

          <label>
            Duración real (min)
            <input
              type="number"
              name="duracion_real"
              value={form.duracion_real}
              onChange={handleChange}
            />
            {errores.duracion && <span className="error-campo">{errores.duracion}</span>}
          </label>

          <label>
            Notas
            <input
              type="text"
              name="notas"
              placeholder="Notas del entrenamiento"
              value={form.notas}
              onChange={handleChange}
            />
          </label>
        </div>

        {ejerciciosEntrenamiento.length > 0 && (
          <>
            <h4>Ejercicios de la rutina</h4>
            {ejerciciosEntrenamiento.map((ej, index) => (
              <div key={ej.ejercicio_id} className="ejercicio-row-card">
                <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>{ej.nombre}</p>
                <div className="form-grid">
                  <label>
                    Series realizadas
                    <input
                      type="number"
                      value={ej.series_realizadas}
                      onChange={(e) => handleEjercicioChange(index, 'series_realizadas', e.target.value)}
                    />
                  </label>
                  <label>
                    Repeticiones realizadas
                    <input
                      type="number"
                      value={ej.repeticiones_realizadas}
                      onChange={(e) => handleEjercicioChange(index, 'repeticiones_realizadas', e.target.value)}
                    />
                  </label>
                  <label>
                    Peso usado (kg)
                    <input
                      type="number"
                      placeholder="0"
                      value={ej.peso_usado}
                      onChange={(e) => handleEjercicioChange(index, 'peso_usado', e.target.value)}
                      min="0"
                    />
                  </label>
                </div>
              </div>
            ))}
            {errores.peso && <p className="error-campo">{errores.peso}</p>}
          </>
        )}

        <button type="submit" className="btn-submit registrar">
          Registrar Entrenamiento
        </button>
      </form>

      <table className="tabla-ejercicios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Rutina</th>
            <th>Duración</th>
            <th>Notas</th>
            <th>Ejercicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entrenamientos.length === 0 ? (
            <tr>
              <td colSpan="7" className="tabla-no-data">
                No hay entrenamientos registrados.
              </td>
            </tr>
          ) : (
            entrenamientos.map((entrenamiento) => (
              <tr key={entrenamiento.id}>
                <td>{entrenamiento.id}</td>
                <td>{entrenamiento.fecha ? new Date(entrenamiento.fecha).toLocaleDateString() : '-'}</td>
                <td>{entrenamiento.Rutina?.nombre || findRutinaNombre(entrenamiento.rutina_id)}</td>
                <td>{entrenamiento.duracion_real || '-'}</td>
                <td>{entrenamiento.notas || '-'}</td>
                <td>
                  {entrenamiento.EjercicioModels?.length > 0 ? (
                    entrenamiento.EjercicioModels.map((ej) => {
                      const meta = ej.EntrenamientoEjercicioModel || ej.RutinaEjercicioModel || {};
                      return (
                        <div key={ej.id}>
                          {ej.nombre} - {meta.series_realizadas ?? '-'}x{meta.repeticiones_realizadas ?? '-'} {meta.peso_usado != null ? `(${meta.peso_usado} kg)` : ''}
                        </div>
                      );
                    })
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(entrenamiento.id)}
                    className="btn-accion btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
