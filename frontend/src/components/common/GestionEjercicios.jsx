import React, { useState, useEffect, useCallback } from 'react';
import { ejercicioService } from '../../services/ejercicioService';
import '../../styles/components/gestionEjercicios.css';

const TIPOS = ['fuerza', 'cardio', 'estiramiento'];

export const GestionEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [count, setCount] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    tipo: 'fuerza',
  });
  const [errores, setErrores] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [progresoData, setProgresoData] = useState(null);
  const [progresoLoading, setProgresoLoading] = useState(false);
  const [progresoError, setProgresoError] = useState('');

  const cargarEjercicios = useCallback(async () => {
    setLoading(true);
    try {
      const datos = filtroActivo
        ? await ejercicioService.getByTipo(filtroActivo)
        : await ejercicioService.getAll();
      setEjercicios(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroActivo]);

  const cargarCount = async () => {
    try {
      const datos = await ejercicioService.getCount();
      setCount(datos.total);
    } catch {
      // si falla el conteo, no mostrar nada
    }
  };

  useEffect(() => {
    cargarEjercicios();
    cargarCount();
  }, [cargarEjercicios]);

  const handleFiltroClick = (tipo) => {
    setFiltroActivo(tipo);
  };

  const handleVerProgreso = async (id) => {
    setProgresoLoading(true);
    setProgresoError('');
    setProgresoData(null);
    try {
      const datos = await ejercicioService.getProgreso(id);
      setProgresoData(datos);
    } catch (err) {
      setProgresoError(err.message);
    } finally {
      setProgresoLoading(false);
    }
  };

  const cerrarProgreso = () => {
    setProgresoData(null);
    setProgresoError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevos = {};
    if (!form.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    try {
      if (isEditing) {
        await ejercicioService.update(editandoId, {
          nombre: form.nombre,
          tipo: form.tipo,
        });
      } else {
        await ejercicioService.create({
          nombre: form.nombre,
          tipo: form.tipo,
        });
      }
      setForm({ nombre: '', tipo: 'fuerza' });
      setErrores({});
      setIsEditing(false);
      setEditandoId(null);
      cargarEjercicios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (ejercicio) => {
    setForm({ nombre: ejercicio.nombre, tipo: ejercicio.tipo });
    setIsEditing(true);
    setEditandoId(ejercicio.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Seguro que querés eliminar el ejercicio con ID ${id}?`)) {
      try {
        await ejercicioService.delete(id);
        cargarEjercicios();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="gestion-container">
        <h2>Gestión de Ejercicios</h2>
        <p>Cargando ejercicios...</p>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <h2>Gestión de Ejercicios</h2>
      {error && <p className="error-mensaje">{error}</p>}

      {count !== null && (
        <p className="total-badge">Total de ejercicios: <strong>{count}</strong></p>
      )}

      <div className="filtros-tabs">
        <button
          className={`filtro-tab ${filtroActivo === null ? 'activo' : ''}`}
          onClick={() => handleFiltroClick(null)}
        >
          Todos
        </button>
        {TIPOS.map((t) => (
          <button
            key={t}
            className={`filtro-tab ${filtroActivo === t ? 'activo' : ''}`}
            onClick={() => handleFiltroClick(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="gestion-form">
        <h3>{isEditing ? 'Editar Ejercicio' : 'Registrar Nuevo Ejercicio'}</h3>
        <div className="form-grid">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del ejercicio"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {errores.nombre && <span className="error-campo">{errores.nombre}</span>}
          </div>
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`btn-submit ${isEditing ? 'editar' : 'registrar'}`}
        >
          {isEditing ? 'Guardar Cambios' : 'Registrar Ejercicio'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => {
              setIsEditing(false);
              setEditandoId(null);
              setForm({ nombre: '', tipo: 'fuerza' });
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
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ejercicios.length === 0 ? (
            <tr>
              <td colSpan="4" className="tabla-no-data">
                No hay ejercicios registrados.
              </td>
            </tr>
          ) : (
            ejercicios.map((ej) => (
              <tr key={ej.id}>
                <td>{ej.id}</td>
                <td>{ej.nombre}</td>
                <td>
                  <span className={`badge-tipo ${ej.tipo}`}>{ej.tipo}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleEditClick(ej)}
                    className="btn-accion btn-editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleVerProgreso(ej.id)}
                    className="btn-accion btn-progreso"
                  >
                    Progreso
                  </button>
                  <button
                    onClick={() => handleDelete(ej.id)}
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
      {progresoData && (
        <div className="modal-overlay" onClick={cerrarProgreso}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>Progreso: {progresoData.ejercicio?.nombre}</h3>
            {progresoData.progreso?.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Series</th>
                    <th>Repeticiones</th>
                    <th>Peso (kg)</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {progresoData.progreso.map((item, index) => (
                    <tr key={index}>
                      <td>{item.entrenamiento?.fecha ? new Date(item.entrenamiento.fecha).toLocaleDateString() : '-'}</td>
                      <td>{item.series_realizadas ?? '-'}</td>
                      <td>{item.repeticiones_realizadas ?? '-'}</td>
                      <td>{item.peso_usado != null ? item.peso_usado : '-'}</td>
                      <td>{item.entrenamiento?.notas || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="tabla-no-data">No hay datos de progreso para este ejercicio.</p>
            )}
            <button className="btn-submit registrar" onClick={cerrarProgreso} style={{ marginTop: 15 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {progresoLoading && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <p>Cargando progreso...</p>
          </div>
        </div>
      )}

      {progresoError && (
        <div className="modal-overlay" onClick={cerrarProgreso}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <p className="error-mensaje">{progresoError}</p>
            <button className="btn-submit registrar" onClick={cerrarProgreso} style={{ marginTop: 15 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
