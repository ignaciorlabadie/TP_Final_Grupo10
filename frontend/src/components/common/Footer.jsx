import React from 'react';
import '../../styles/components/footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} FitTracker — Todos los derechos reservados</p>
    </footer>
  );
};
