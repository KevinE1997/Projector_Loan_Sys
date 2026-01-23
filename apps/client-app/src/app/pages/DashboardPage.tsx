import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Borramos la llave
    navigate('/login'); // Lo mandamos afuera
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>👋 Bienvenido al Sistema PLMS</h1>
      <p>Selecciona un módulo para comenzar:</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        {/* Botón para Inventario */}
        <button 
          onClick={() => navigate('/inventory')}
          style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          📦 Gestionar Proyectores
        </button>

        {/* Aquí pondremos el botón de Préstamos más adelante */}
        <button 
          style={{ padding: '20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '8px' }}
          disabled
        >
          📅 Préstamos (Próximamente)
        </button>
      </div>

      <button 
        onClick={handleLogout}
        style={{ marginTop: '50px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};