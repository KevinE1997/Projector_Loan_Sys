import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage'; // La que creamos antes
import { LoansPage } from './pages/LoansPage';
import { ActiveLoansPage } from './pages/ActiveLoansPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto: Redirigir al Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Ruta 1: Login */}
        <Route path="/login" element={<LoginPage />} />


        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/active-loans" element={<ActiveLoansPage />} />
          <Route path="/loans" element={<LoansPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;