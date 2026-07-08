import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { GestionEjercicios } from './components/common/GestionEjercicios';
import { GestionRutinas } from './components/common/GestionRutinas';
import { GestionEntrenamientos } from './components/common/GestionEntrenamientos';
import { GestionEstadisticas } from './components/common/GestionEstadisticas';
import { NotFound } from './components/common/NotFound';
import { PrivateRoute } from './components/common/PrivateRoute';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { Login } from './components/JWT/Login';
import { Register } from './components/JWT/Register';
import { Perfil } from './components/JWT/Perfil';
import { ListaUsuarios } from './components/JWT/ListaUsuarios';

import { AuthProvider } from './hooks/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />

        <header className="App-header">
          <h1>Panel de Control de Ejercicios</h1>
          <p>Demostración Full-Stack (React + Node.js + PostgreSQL)</p>

          <div className="contenido">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ejercicios" element={<PrivateRoute><GestionEjercicios /></PrivateRoute>} />
              <Route path="/rutinas" element={<PrivateRoute><GestionRutinas /></PrivateRoute>} />
              <Route path="/entrenamientos" element={<PrivateRoute><GestionEntrenamientos /></PrivateRoute>} />
              <Route path="/estadisticas" element={<PrivateRoute><GestionEstadisticas /></PrivateRoute>} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
              <Route path="/usuarios" element={<PrivateRoute><ListaUsuarios /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </header>

        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
