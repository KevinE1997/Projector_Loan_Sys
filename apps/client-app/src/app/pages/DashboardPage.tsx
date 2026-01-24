import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // <--- Importamos los estilos

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Agregamos un confirm para evitar clicks accidentales
    if(window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Encabezado */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">👋 Bienvenido al Sistema PLMS</h1>
        <p className="dashboard-subtitle">Panel de control de gestión de proyectores multimedia</p>
      </div>

      {/* Grid de Módulos */}
      <div className="dashboard-grid">
        
        {/* TARJETA 1: INVENTARIO */}
        <div className="card-module card-inventory" onClick={() => navigate('/inventory')}>
          <div className="icon-container">📦</div>
          <span className="card-title">Inventario General</span>
          <p className="card-desc">
            Consulta la disponibilidad de equipos y registra <strong>nuevos préstamos</strong>.
          </p>
        </div>

        {/* TARJETA 2: PRÉSTAMOS ACTIVOS (DEVOLVER) */}
        <div className="card-module card-active" onClick={() => navigate('/active-loans')}>
          <div className="icon-container">⏱️</div>
          <span className="card-title">Devoluciones Pendientes</span>
          <p className="card-desc">
            Gestiona los equipos que están actualmente prestados y registra su <strong>retorno</strong>.
          </p>
        </div>

        {/* TARJETA 3: HISTORIAL (EL ANTIGUO BOTÓN BLOQUEADO) */}
        <div className="card-module card-history" onClick={() => navigate('/loans')}>
          <div className="icon-container">📜</div>
          <span className="card-title">Historial y Auditoría</span>
          <p className="card-desc">
            Consulta el registro histórico completo de todos los préstamos realizados y finalizados.
          </p>
        </div>

      </div>

      {/* Botón Salir */}
      <div className="logout-container">
        <button onClick={handleLogout} className="btn-logout">
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>

    </div>
  );
};