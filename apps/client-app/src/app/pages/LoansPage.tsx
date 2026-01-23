import { useEffect, useState } from 'react';
import { loansService } from '../services/loans.service';

export const LoansPage = () => {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        setLoading(true);
        try {
            const data = await loansService.getAllLoans();
            setLoans(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando préstamos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (loanId: string) => {
        if (!confirm('¿Confirmar devolución de proyector?')) return;
        try {
            await loansService.returnProjector(loanId);
            alert('Proyector devuelto con éxito');
            loadLoans(); // Recargar lista
        } catch (error) {
            alert('Error al procesar devolución');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>📋 Historial y Préstamos Activos</h2>
            
            {loading ? <p>Cargando préstamos...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }} border={1}>
                    <thead style={{ background: '#343a40', color: 'white' }}>
                        <tr>
                            <th style={pStyle}>ID Préstamo</th>
                            <th style={pStyle}>Proyector (ID)</th>
                            <th style={pStyle}>Usuario</th>
                            <th style={pStyle}>Fecha Retorno</th>
                            <th style={pStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length > 0 ? loans.map((loan) => (
                            <tr key={loan.id}>
                                <td style={pStyle}>{loan.id.substring(0,8)}...</td>
                                <td style={pStyle}>{loan.projectorId}</td>
                                <td style={pStyle}>{loan.userId}</td>
                                <td style={pStyle}>{new Date(loan.returnDate).toLocaleDateString()}</td>
                                <td style={pStyle}>
                                    {!loan.actualReturnDate && (
                                        <button onClick={() => handleReturn(loan.id)} style={btnStyle}>
                                            Devolver
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>No hay préstamos registrados</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const pStyle = { padding: '10px', textAlign: 'left' as const };
const btnStyle = { background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };