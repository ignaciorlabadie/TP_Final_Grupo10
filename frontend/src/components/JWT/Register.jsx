import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/components/register.css';

export const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const datos = await authService.register(nombre, email, password);
      // Guardamos el token para que ya quede logueado al registrarse
      localStorage.setItem('token', datos.token);
      setExito(true);

      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h3 className="register-title">Registro de Nuevo Usuario</h3>

      {error && <div className="register-error">⚠️ {error}</div>}

      {exito && (
        <div className="register-success">
          ¡Registro exitoso! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-submit">
          Registrar Cuenta
        </button>
      </form>

      <p className="register-footer">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
};