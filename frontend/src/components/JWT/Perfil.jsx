import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/components/perfil.css';

export const Perfil = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const pedirPerfil = async () => {
      try {
        const datos = await authService.getPerfil();
        setUsuario(datos.user);
      } catch (err) {
        setError(err.message);
      }
    };

    pedirPerfil();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) {
    return (
      <div className="perfil-error">
        <h3>⚠️ Acceso Denegado</h3>
        <p>{error}</p>
        <Link to="/login">Ir al Login</Link>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="perfil-loading">Cargando datos del perfil oficial...</div>
    );
  }

  return (
    <div className="perfil-container">
      <h3 className="perfil-title">🔒 Tu Perfil Protegido (JWT)</h3>
      <hr className="perfil-divider" />
      <p>
        <strong>ID de Usuario:</strong> {usuario.id}
      </p>
      <p>
        <strong>Nombre completo:</strong> {usuario.nombre}
      </p>
      <p>
        <strong>Email registrado:</strong> {usuario.email}
      </p>

      <div className="perfil-actions">
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión (Borrar Token)
        </button>
      </div>
    </div>
  );
};