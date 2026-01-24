import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './Auth.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Quitamos 'role' del estado porque ya no es un campo del formulario
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // AQUÍ ESTÁ EL CAMBIO CLAVE:
      // Pasamos manualmente 'user' como cuarto argumento.
      // El usuario ya no puede elegirlo.
      await authService.register(formData.name, formData.email, formData.password, 'user');
      
      alert('✅ Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error: any) {
      alert('Error: ' + (error.message || 'No se pudo registrar'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div className="brand-logo">📝</div>
        
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Regístrate para solicitar equipos</p>

        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="usuario@plms.com"
              required
              autoComplete="email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          {/* Password */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Elige una clave segura"
              required
              autoComplete="new-password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* ELIMINADO: Ya no existe el <select> de roles.
             El usuario no ve ninguna opción, es 'user' por defecto.
          */}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta ✨'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta?
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </div>

      </div>
    </div>
  );
};