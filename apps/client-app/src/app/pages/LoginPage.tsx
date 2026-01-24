import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './Auth.css'; // <--- IMPORTANTE

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      alert(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Logo / Icono */}
        <div className="brand-logo">📽️</div>
        
        <h1 className="auth-title">Bienvenido</h1>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="ejemplo@plms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span>🔄 Conectando...</span>
            ) : (
              <span>Ingresar al Sistema 🚀</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes acceso?
          <Link to="/register" className="auth-link">Regístrate aquí</Link>
        </div>

      </div>
    </div>
  );
};