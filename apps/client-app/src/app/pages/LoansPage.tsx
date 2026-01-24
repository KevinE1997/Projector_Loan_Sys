import React, { useEffect, useState } from 'react';
import { loansService } from '../services/loans.service';
import './LoansPage.css';

export const LoansPage = () => {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await loansService.getLoans();
            // Ordenamos por fecha: lo más reciente primero
            const sortedHistory = data.sort((a: any, b: any) => 
                new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );
            setLoans(sortedHistory);
        } catch (error) {
            console.error("Error cargando historial:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="history-container">
            <div className="history-header">
                <h1 className="history-title">📜 Historial General de Préstamos</h1>
                <p className="history-subtitle">Auditoría completa de equipos prestados y devueltos.</p>
            </div>

            {loading ? (
                <div className="text-center p-10 text-gray-500">Cargando registros...</div>
            ) : (
                <div className="history-card">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Proyector</th>
                                <th>Usuario</th>
                                <th>Fecha Préstamo</th>
                                <th>Fecha Devolución</th>
                                <th>Observaciones</th> {/* <--- NUEVA COLUMNA */}
                                <th>ID Transacción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => {
                                const isActive = loan.status === 'ACTIVE';
                                
                                return (
                                    <tr key={loan.id}>
                                        {/* 1. Estado */}
                                        <td>
                                            <span className={`badge ${isActive ? 'badge-active' : 'badge-returned'}`}>
                                                {isActive ? '🟢 En Uso' : '⚪ Finalizado'}
                                            </span>
                                        </td>

                                        {/* 2. Proyector */}
                                        <td>
                                            <span style={{fontWeight: 600}}>
                                                Proyector {loan.projectorId.slice(0, 4)}
                                            </span>
                                        </td>

                                        {/* 3. Usuario */}
                                        <td>{loan.userId || 'Desconocido'}</td>

                                        {/* 4. Fecha Inicio */}
                                        <td>
                                            <div className="date-main">
                                                {new Date(loan.startDate).toLocaleDateString()}
                                            </div>
                                            <div className="date-sub">
                                                {new Date(loan.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </td>

                                        {/* 5. Fecha Devolución */}
                                        <td>
                                            {loan.returnDate ? (
                                                <>
                                                    <div className="date-main text-gray-600">
                                                        {new Date(loan.returnDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="date-sub">
                                                        {new Date(loan.returnDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </>
                                            ) : (
                                                <span style={{color: '#cbd5e0'}}>-- Pendiente --</span>
                                            )}
                                        </td>

                                        {/* 6. OBSERVACIONES (NUEVO) */}
                                        <td style={{maxWidth: '200px'}}>
                                            {loan.observations ? (
                                                <span className="text-observations">
                                                    "{loan.observations}"
                                                </span>
                                            ) : (
                                                <span style={{color: '#cbd5e0', fontSize: '12px'}}>- Sin notas -</span>
                                            )}
                                        </td>

                                        {/* 7. ID Técnico */}
                                        <td>
                                            <span className="text-mono">
                                                {loan.id.split('-')[0]}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {loans.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{textAlign: 'center', padding: '40px', color: '#a0aec0'}}>
                                        No se encontraron registros en el sistema.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};