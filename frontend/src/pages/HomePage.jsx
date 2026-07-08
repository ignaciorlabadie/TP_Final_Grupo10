import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import '../styles/components/homePage.css';

const CARD_DATA = [
  { to: '/ejercicios', titulo: 'Ejercicios', descripcion: 'Gestionar ejercicios', emoji: '🏋️' },
  { to: '/rutinas', titulo: 'Rutinas', descripcion: 'Crear y editar rutinas', emoji: '📋' },
  { to: '/entrenamientos', titulo: 'Entrenamientos', descripcion: 'Registrar entrenamientos', emoji: '🏃' },
  { to: '/estadisticas', titulo: 'Estadísticas', descripcion: 'Ver datos y métricas', emoji: '📊' },
];

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="home-grid">
        {CARD_DATA.map((card) => (
          <Link key={card.to} to={card.to} className="home-card">
            <span className="home-card-emoji">{card.emoji}</span>
            <h3>{card.titulo}</h3>
            <p>{card.descripcion}</p>
          </Link>
        ))}

        {isAuthenticated && (
          <Link to="/perfil" className="home-card">
            <span className="home-card-emoji">🔒</span>
            <h3>Perfil</h3>
            <p>Tu información personal</p>
          </Link>
        )}
      </div>
    </div>
  );
};
