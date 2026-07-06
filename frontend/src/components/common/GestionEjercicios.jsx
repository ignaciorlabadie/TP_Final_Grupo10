import React, { useState, useEffect } from 'react';
import { ejercicioService } from '../../services/ejercicioService';
import '../../styles/components/gestionEjercicios.css';

const TIPOS = ['fuerza', 'cardio', 'estiramiento'];

export const GestionEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    tipo: 'fuerza',
  });
  const [errores, setErrores] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const cargarEjercicios = async () => {
    setLoading(true);
    try {
      const datos = await ejercicioService.getAll();
      setEjercicios(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEjercicios();
  }, []);

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
    </div>
  );
};
