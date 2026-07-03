import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/components/login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const datos = await authService.login(email, password);
      localStorage.setItem('token', datos.token);
      navigate('/perfil');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h3 className="login-title">Iniciar Sesión</h3>
      {error && <div className="login-error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
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
          Ingresar
        </button>
      </form>

      <p className="login-footer">
        ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
      </p>
    </div>
  );
};