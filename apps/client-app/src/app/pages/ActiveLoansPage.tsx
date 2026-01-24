import React, { useEffect, useState } from 'react';
import { loansService } from '../services/loans.service';
import './ActiveLoansPage.css'; // <--- IMPORTANTE: Importamos los estilos aquí

export const ActiveLoansPage = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const data = await loansService.getLoans();
      const activeOnly = data
        .filter((l: any) => l.status === 'ACTIVE')
        .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      
      setLoans(activeOnly);
    } catch (error) {
      console.error("Error cargando préstamos", error);
    }
  };

  const handleReturn = async (loanId: string) => {
    const observations = prompt("📝 Observaciones de devolución (Opcional):", "Todo en orden");
    if (observations === null) return; 

    if (!window.confirm("¿Confirmar devolución y liberar proyector?")) return;

    try {
      setLoading(true);
      await loansService.returnLoan(loanId, observations);
      alert("✅ ¡Devolución exitosa!");
      setLoans(current => current.filter(l => l.id !== loanId));
    } catch (error: any) {
      alert("⚠️ Error: " + error.message);
    } finally {
      setLoading(false);
      loadLoans(); 
    }
  };

  return (
    <div className="loans-container">
      
      {/* Encabezado */}
      <div className="loans-header">
        <div>
          <h1 className="loans-title">📋 Mis Préstamos Activos</h1>
          <p className="loans-subtitle">Gestiona y devuelve tus equipos asignados.</p>
        </div>
        <div className="badge-count">
          {loans.length} {loans.length === 1 ? 'Préstamo' : 'Préstamos'}
        </div>
      </div>

      {/* Estado vacío o Tabla */}
      {loans.length === 0 ? (
        <div className="empty-state">
          <h3>🎉 ¡Todo limpio!</h3>
          <p>No tienes equipos pendientes de devolución.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Proyector</th>
                <th>ID Transacción</th>
                <th>Fecha de Préstamo</th>
                <th>Estado</th>
                <th style={{textAlign: 'center'}}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  
                  {/* Proyector + Icono */}
                  <td>
                    <div className="projector-info">
                      <div className="icon-box">📽️</div>
                      <div>
                        <span className="projector-name">Proyector {loan.projectorId.slice(0, 5)}...</span>
                        <span className="projector-id-sub">ID: {loan.projectorId}</span>
                      </div>
                    </div>
                  </td>

                  {/* ID Corto */}
                  <td>
                    <span className="id-badge">
                      {loan.id.split('-')[0]}...
                    </span>
                  </td>

                  {/* Fecha */}
                  <td>
                    <div style={{fontWeight: 500}}>
                      {new Date(loan.startDate).toLocaleDateString()}
                    </div>
                    <div style={{fontSize: '12px', color: '#718096'}}>
                      {new Date(loan.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>

                   {/* Estado */}
                   <td>
                    <span className="status-badge">🟢 Activo</span>
                  </td>

                  {/* Botón */}
                  <td style={{textAlign: 'center'}}>
                    <button
                      onClick={() => handleReturn(loan.id)}
                      disabled={loading}
                      className="btn-return"
                    >
                      {loading ? 'Procesando...' : 'Devolver ↩️'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};