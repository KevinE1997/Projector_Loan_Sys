import React, { useEffect, useState } from 'react';
import { loansService } from '../services/loans.service';
import './ActiveLoansPage.css'; // <--- ¡Asegúrate de que este archivo exista!

export const ActiveLoansPage = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. SEGURIDAD: Leemos el Rol
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const data = await loansService.getLoans();
      
      // Filtramos solo los activos
      let activeOnly = data.filter((l: any) => l.status === 'ACTIVE');

      // Ordenar: Más recientes primero
      activeOnly.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      
      setLoans(activeOnly);
    } catch (error) {
      console.error("Error cargando préstamos", error);
    }
  };

  const handleReturn = async (loanId: string) => {
    if (!isAdmin) return; // Doble chequeo de seguridad

    const observations = prompt("📝 Observaciones de recepción:", "Equipo en buen estado");
    if (observations === null) return; 

    if (!window.confirm("¿Confirmar devolución y finalizar préstamo?")) return;

    try {
      setLoading(true);
      await loansService.returnLoan(loanId, observations);
      alert("✅ Devolución procesada correctamente.");
      setLoans(current => current.filter(l => l.id !== loanId));
    } catch (error: any) {
      alert("⚠️ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loans-container">
      
      {/* ENCABEZADO */}
      <div className="loans-header">
        <div>
          <h1 className="loans-title">📋 Préstamos Activos</h1>
          <p className="loans-subtitle">
            {isAdmin 
                ? "Vista de Administrador: Gestionar devoluciones." 
                : "Mis equipos asignados actualmente."}
          </p>
        </div>
        <div className="badge-count">
          {loans.length} {loans.length === 1 ? 'Activo' : 'Activos'}
        </div>
      </div>

      {/* ESTADO VACÍO */}
      {loans.length === 0 ? (
        <div className="empty-state">
          <h3>🎉 ¡Todo limpio!</h3>
          <p>No hay equipos pendientes de devolución en este momento.</p>
        </div>
      ) : (
        /* TABLA ESTILIZADA */
        <div className="table-card">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Proyector</th>
                <th>Usuario / Responsable</th> {/* Columna Nueva */}
                <th>Fecha Inicio</th>
                <th>Estado / Acción</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  
                  {/* 1. INFO PROYECTOR */}
                  <td>
                    <div className="projector-info">
                      <div className="icon-box">📽️</div>
                      <div>
                        <span className="projector-name">
                            Proyector {loan.projectorId ? loan.projectorId.slice(0, 5) : 'ID'}...
                        </span>
                        <span className="projector-id-sub">
                            ID: {loan.projectorId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. INFO USUARIO (NUEVO) */}
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: '10px', fontSize: '20px'}}>👤</div>
                        <div>
                            <span style={{display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px'}}>
                                {loan.userEmail || "Email no disponible"}
                            </span>
                            <span style={{fontSize: '12px', color: '#718096'}}>Solicitante</span>
                        </div>
                    </div>
                  </td>

                  {/* 3. FECHA */}
                  <td>
                    <div style={{fontWeight: 500, color: '#2d3748'}}>
                      {new Date(loan.startDate).toLocaleDateString()}
                    </div>
                    <div style={{fontSize: '12px', color: '#718096'}}>
                      {new Date(loan.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>

                   {/* 4. ACCIÓN (Lógica de Roles) */}
                   <td style={{textAlign: 'center'}}>
                    {isAdmin ? (
                        // SI ES ADMIN: Botón de Devolver
                        <button
                          onClick={() => handleReturn(loan.id)}
                          disabled={loading}
                          className="btn-return"
                        >
                          {loading ? '...' : '📥 Recibir'}
                        </button>
                    ) : (
                        // SI ES USUARIO: Etiqueta "En Uso"
                        <span className="status-badge" style={{background: '#fffaf0', color: '#c05621', border: '1px solid #fbd38d'}}>
                          ⏳ En uso
                        </span>
                    )}
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