import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';
import { Projector, CreateProjectorDto, ProjectorStatus } from '../../types/inventory.types';
import { loansService } from '../services/loans.service';

export const InventoryPage = () => {
    const [projectors, setProjectors] = useState<Projector[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<CreateProjectorDto>({
        serialNumber: '',
        brand: '',
        model: '',
        lumens: 3000
    });

    useEffect(() => {
        loadProjectors();
    }, []);

    const loadProjectors = async () => {
        setLoading(true);
        setError(''); // Limpiar errores previos
        try {
            const data: any = await inventoryService.getAllProjectors();
            console.log("📢 RESPUESTA DEL BACKEND:", data);

            // Ahora que sabemos que llega un array directo:
            if (Array.isArray(data)) {
                setProjectors(data);
            } else if (data?.data && Array.isArray(data.data)) {
                setProjectors(data.data);
            } else {
                setProjectors([]);
            }
        } catch (err: any) {
            console.error(err);
            setError('No se pudo conectar con el servicio de inventario.');
            setProjectors([]);
        } finally {
            setLoading(false); // Siempre quitamos el loading al terminar
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                lumens: Number(formData.lumens)
            };

            await inventoryService.createProjector(payload);

            setFormData({ serialNumber: '', brand: '', model: '', lumens: 3000 });
            alert('¡Proyector creado con éxito!');
            loadProjectors(); // Recargar la lista

        } catch (err: any) {
            console.error(err);
            alert('Error al crear: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusColor = (status: ProjectorStatus) => {
        switch (status) {
            case ProjectorStatus.AVAILABLE: return '#28a745'; // Verde
            case ProjectorStatus.LOANED: return '#ffc107';    // Naranja
            case ProjectorStatus.MAINTENANCE: return '#dc3545'; // Rojo
            default: return '#6c757d'; // Gris
        }
    };

    const handleRequestLoan = async (projectorId: string) => {
        const userId = prompt("Ingrese el ID del usuario:");
        const days = prompt("¿Por cuántos días es el préstamo?", "1");

        if (!userId || !days) return;

        // Calculamos las fechas que la ENTIDAD Loan espera
        const startDate = new Date(); // Hoy
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + parseInt(days)); // Hoy + N días

        try {
            setLoading(true);
            await loansService.createLoan({
                projectorId,
                userId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                // No enviamos returnDate aquí porque aún no ha sido devuelto
                observations: "Préstamo solicitado desde el panel de inventario"
            });

            alert("✅ Préstamo creado con éxito");
            await loadProjectors();
        } catch (err: any) {
            // ... error handling ...
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>📽️ Gestión de Proyectores</h2>

            {/* --- FORMULARIO --- */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
                <h3 style={{ marginTop: 0 }}>Agregar Nuevo Proyector</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
                    <input name="serialNumber" placeholder="Número de Serie" required value={formData.serialNumber} onChange={handleInputChange} style={inputStyle} />
                    <input name="brand" placeholder="Marca" required value={formData.brand} onChange={handleInputChange} style={inputStyle} />
                    <input name="model" placeholder="Modelo" required value={formData.model} onChange={handleInputChange} style={inputStyle} />
                    <input name="lumens" type="number" placeholder="Lúmenes" required value={formData.lumens} onChange={handleInputChange} style={inputStyle} />
                    <button type="submit" style={buttonStyle}>Guardar Proyector</button>
                </form>
            </div>

            {/* --- TABLA --- */}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {error}</p>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>⏳ Cargando inventario...</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <thead style={{ background: '#343a40', color: 'white' }}>
                        <tr>
                            <th style={thStyle}>Serial</th>
                            <th style={thStyle}>Marca</th>
                            <th style={thStyle}>Modelo</th>
                            <th style={thStyle}>Lúmenes</th>
                            <th style={thStyle}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectors.length > 0 ? (
                            projectors.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>{p.serialNumber}</td>
                                    <td style={tdStyle}>{p.brand}</td>
                                    <td style={tdStyle}>{p.model}</td>
                                    <td style={tdStyle}>{p.lumens}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            backgroundColor: getStatusColor(p.status),
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.85em',
                                            fontWeight: 'bold'
                                        }}>
                                            {p.status}
                                        </span>

                                        {/* BOTÓN DE ACCIÓN: Solo si está disponible */}
                                        {p.status === 'AVAILABLE' && (
                                            <button
                                                onClick={() => handleRequestLoan(p.id)}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8em'
                                                }}
                                            >
                                                Prestar ➡️
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                    No se encontraron proyectores en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Estilos rápidos en objetos para no depender de CSS externo por ahora
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { gridColumn: 'span 2', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const thStyle = { padding: '12px', textAlign: 'left' as const };
const tdStyle = { padding: '12px' };