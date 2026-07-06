import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/notFound.css';

export const NotFound = () => {
  return (
    <div className="not-found-container">
      <h2>404 - Página no encontrada</h2>
      <p>La ruta a la que intentás acceder no existe.</p>
      <Link to="/" className="btn-submit registrar">Volver al inicio</Link>
    </div>
  );
};
