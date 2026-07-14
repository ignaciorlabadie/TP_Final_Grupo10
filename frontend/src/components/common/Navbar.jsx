import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import '../../styles/components/navbar.css';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">IronSync</Link>
      </div>
      <ul className="navbar-links">
        {isAuthenticated && (
          <>
            <li><Link to="/ejercicios">Ejercicios</Link></li>
            <li><Link to="/rutinas">Rutinas</Link></li>
            <li><Link to="/entrenamientos">Entrenamientos</Link></li>
            <li><Link to="/estadisticas">Estadísticas</Link></li>
            <li><Link to="/usuarios">Usuarios</Link></li>
          </>
        )}
        <li><Link to="/usuarios">Usuarios</Link></li>
        {!isAuthenticated ? (
          <>
            <li><Link to="/register">Registrarse</Link></li>
            <li><Link to="/login">Iniciar Sesión</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><button onClick={logout} className="btn-logout-nav">Cerrar Sesión</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};
