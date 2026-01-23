import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage'; // La que creamos antes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto: Redirigir al Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta 1: Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta 2: El Menú Principal */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Ruta 3: El Inventario de Proyectores */}
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;