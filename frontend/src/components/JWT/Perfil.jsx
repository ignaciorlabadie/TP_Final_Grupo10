import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/AuthContext';
import '../../styles/components/perfil.css';

export const Perfil = () => {
  const { logout } = useAuth();
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
        <button onClick={logout} className="btn-logout">
          Cerrar Sesión (Borrar Token)
        </button>
      </div>
    </div>
  );
};