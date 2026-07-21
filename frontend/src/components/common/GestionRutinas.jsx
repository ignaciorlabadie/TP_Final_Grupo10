import React, { useState, useEffect } from 'react';
import { rutinaService } from '../../services/rutinaService';
import { ejercicioService } from '../../services/ejercicioService';
import '../../styles/components/gestionRutinas.css';

export const GestionRutinas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    duracion_minutos: '',
  });
  const [errores, setErrores] = useState({});
  const [ejercicios, setEjercicios] = useState([]);
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([
    { ejercicio_id: '', series: 3, repeticiones: 10, descanso_segundos: 60 },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const cargarRutinas = async () => {
    try {
      const datos = await rutinaService.getAll();
      setRutinas(datos);
    } catch (err) {
      setError(err.message);
    }
  };

  const cargarEjercicios = async () => {
    try {
      const datos = await ejercicioService.getAll();
      const unicos = datos.filter((ej, i, arr) => arr.findIndex((e) => e.id === ej.id) === i);
      setEjercicios(unicos);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      setLoading(true);
      await Promise.all([cargarRutinas(), cargarEjercicios()]);
      setLoading(false);
    };
    inicializar();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEjercicioChange = (index, field, value) => {
    const nuevos = [...ejerciciosSeleccionados];
    nuevos[index][field] = value;
    setEjerciciosSeleccionados(nuevos);
  };

  const handleAgregarEjercicio = () => {
    setEjerciciosSeleccionados([
      ...ejerciciosSeleccionados,
      { ejercicio_id: '', series: 3, repeticiones: 10, descanso_segundos: 60 },
    ]);
  };

  const handleQuitarEjercicio = (index) => {
    const nuevos = ejerciciosSeleccionados.filter((_, i) => i !== index);
    setEjerciciosSeleccionados(nuevos.length ? nuevos : [{ ejercicio_id: '', series: 3, repeticiones: 10, descanso_segundos: 60 }]);
  };

  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio';
    if (form.duracion_minutos && Number(form.duracion_minutos) < 0) nuevos.duracion = 'La duración no puede ser negativa';
    const sinEjercicio = ejerciciosSeleccionados.some((ej) => !ej.ejercicio_id);
    if (sinEjercicio) nuevos.ejercicios = 'Todos los ejercicios deben estar seleccionados';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setError('');

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      duracion_minutos: Number(form.duracion_minutos) || null,
      ejercicios: ejerciciosSeleccionados.map((ej) => ({
        ejercicio_id: Number(ej.ejercicio_id),
        series: Number(ej.series),
        repeticiones: Number(ej.repeticiones),
        descanso_segundos: Number(ej.descanso_segundos),
      })),
    };

    try {
      if (isEditing) {
        await rutinaService.update(editandoId, payload);
      } else {
        await rutinaService.create(payload);
      }
      setForm({ nombre: '', descripcion: '', duracion_minutos: '' });
      setEjerciciosSeleccionados([{ ejercicio_id: '', series: 3, repeticiones: 10, descanso_segundos: 60 }]);
      setErrores({});
      setIsEditing(false);
      setEditandoId(null);
      cargarRutinas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (rutina) => {
    setForm({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion || '',
      duracion_minutos: rutina.duracion_minutos || '',
    });
    setEjerciciosSeleccionados(
      rutina.EjercicioModels?.length
        ? rutina.EjercicioModels.map((ej) => ({
            ejercicio_id: ej.id,
            series: ej.RutinaEjercicioModel?.series || 3,
            repeticiones: ej.RutinaEjercicioModel?.repeticiones || 10,
            descanso_segundos: ej.RutinaEjercicioModel?.descanso_segundos || 60,
          }))
        : [{ ejercicio_id: '', series: 3, repeticiones: 10, descanso_segundos: 60 }]
    );
    setIsEditing(true);
    setEditandoId(rutina.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Seguro que querés eliminar la rutina ${id}?`)) {
      try {
        await rutinaService.delete(id);
        cargarRutinas();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="gestion-container">
        <h2>Gestión de Rutinas</h2>
        <p>Cargando rutinas...</p>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <h2>Gestión de Rutinas</h2>
      {error && <p className="error-mensaje">{error}</p>}

      <form onSubmit={handleSubmit} className="gestion-form">
        <h3>{isEditing ? 'Editar Rutina' : 'Registrar Nueva Rutina'}</h3>
        <div className="form-grid">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la rutina"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {errores.nombre && <span className="error-campo">{errores.nombre}</span>}
          </div>
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
          />
          <div>
            <input
              type="number"
              name="duracion_minutos"
              placeholder="Duración (min)"
              value={form.duracion_minutos}
              onChange={handleChange}
            />
            {errores.duracion && <span className="error-campo">{errores.duracion}</span>}
          </div>
        </div>

        <h4>Ejercicios</h4>
        {ejerciciosSeleccionados.map((ej, index) => (
          <div key={index} className="ejercicio-row-card">
            <select
              value={ej.ejercicio_id}
              onChange={(e) => handleEjercicioChange(index, 'ejercicio_id', e.target.value)}
              required
            >
              <option value="">Seleccionar ejercicio</option>
              {ejercicios.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.nombre}
                </option>
              ))}
            </select>
            <div className="form-grid">
              <label>
                Series
                <input
                  type="number"
                  value={ej.series}
                  onChange={(e) => handleEjercicioChange(index, 'series', e.target.value)}
                />
              </label>
              <label>
                Repeticiones
                <input
                  type="number"
                  value={ej.repeticiones}
                  onChange={(e) => handleEjercicioChange(index, 'repeticiones', e.target.value)}
                />
              </label>
              <label>
                Descanso (seg)
                <input
                  type="number"
                  value={ej.descanso_segundos}
                  onChange={(e) => handleEjercicioChange(index, 'descanso_segundos', e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn-accion btn-eliminar"
              onClick={() => handleQuitarEjercicio(index)}
            >
              Quitar
            </button>
          </div>
        ))}
        {errores.ejercicios && <p className="error-campo">{errores.ejercicios}</p>}
        <button type="button" className="btn-submit registrar" onClick={handleAgregarEjercicio} style={{ marginBottom: 10 }}>
          + Agregar ejercicio
        </button>

        <button type="submit" className={`btn-submit ${isEditing ? 'editar' : 'registrar'}`}>
          {isEditing ? 'Guardar Cambios' : 'Registrar Rutina'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => {
              setIsEditing(false);
              setEditandoId(null);
              setForm({ nombre: '', descripcion: '', duracion_minutos: '' });
              setEjerciciosSeleccionados([{ ejercicio_id: '', series: 3, repeticiones: 10, descanso_segundos: 60 }]);
              setErrores({});
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="tabla-ejercicios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Duración</th>
            <th>Ejercicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutinas.length === 0 ? (
            <tr>
              <td colSpan="6" className="tabla-no-data">
                No hay rutinas registradas.
              </td>
            </tr>
          ) : (
            rutinas.map((rutina) => (
              <tr key={rutina.id}>
                <td>{rutina.id}</td>
                <td>{rutina.nombre}</td>
                <td>{rutina.descripcion}</td>
                <td>{rutina.duracion_minutos || '-'}</td>
                <td>{rutina.EjercicioModels?.map((ej) => ej.nombre).join(', ')}</td>
                <td>
                  <button onClick={() => handleEditClick(rutina)} className="btn-accion btn-editar">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(rutina.id)} className="btn-accion btn-eliminar">
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
