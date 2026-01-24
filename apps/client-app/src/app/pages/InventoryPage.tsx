import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';
import { Projector, CreateProjectorDto, ProjectorStatus } from '../../types/inventory.types';
import { loansService } from '../services/loans.service';
import './InventoryPage.css'; // <--- IMPORTANTE: Importar estilos

export const InventoryPage = () => {
    const [projectors, setProjectors] = useState<Projector[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. OBTENER ROL PARA SEGURIDAD VISUAL
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';

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
        setError('');
        try {
            const data: any = await inventoryService.getAllProjectors();
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
            setLoading(false);
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
            const payload = { ...formData, lumens: Number(formData.lumens) };
            await inventoryService.createProjector(payload);
            setFormData({ serialNumber: '', brand: '', model: '', lumens: 3000 });
            alert('¡Proyector creado con éxito!');
            loadProjectors();
        } catch (err: any) {
            console.error(err);
            alert('Error al crear: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusColor = (status: ProjectorStatus) => {
        switch (status) {
            case ProjectorStatus.AVAILABLE: return '#c6f6d5'; // Fondo Verde Claro
            case ProjectorStatus.LOANED: return '#ffebee';    // Fondo Rojo/Naranja Claro
            case ProjectorStatus.MAINTENANCE: return '#fed7d7'; // Rojo Mantenimiento
            default: return '#e2e8f0';
        }
    };

    const getStatusTextColor = (status: ProjectorStatus) => {
        switch (status) {
            case ProjectorStatus.AVAILABLE: return '#22543d'; // Texto Verde Oscuro
            case ProjectorStatus.LOANED: return '#c53030';    // Texto Rojo Oscuro
            default: return '#4a5568';
        }
    };

    const handleRequestLoan = async (projectorId: string) => {
        // NOTA: Idealmente, aquí usarías el ID del usuario logueado o un selector de usuarios
        const userId = prompt("🆔 Ingrese el ID del usuario solicitante (Email o ID):");
        if (!userId) return;

        const days = prompt("📅 ¿Por cuántos días es el préstamo?", "1");
        if (!days) return;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + parseInt(days));

        try {
            setLoading(true);
            await loansService.createLoan({
                projectorId,
                userId, // El backend debe resolver este ID
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                observations: "Préstamo solicitado desde Panel Web"
            });
            alert("✅ Préstamo creado con éxito");
            await loadProjectors();
        } catch (err: any) {
            alert("Error al prestar: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h2 className="inventory-title">📽️ Gestión de Proyectores</h2>
            </div>

            {/* --- FORMULARIO (SOLO ADMIN) --- */}
            {isAdmin && (
                <div className="form-card">
                    <h3 className="form-title">Agregar Nuevo Equipo</h3>
                    <form onSubmit={handleSubmit} className="inventory-form">
                        <input name="serialNumber" placeholder="Número de Serie" required value={formData.serialNumber} onChange={handleInputChange} className="form-input" />
                        <input name="brand" placeholder="Marca" required value={formData.brand} onChange={handleInputChange} className="form-input" />
                        <input name="model" placeholder="Modelo" required value={formData.model} onChange={handleInputChange} className="form-input" />
                        <input name="lumens" type="number" placeholder="Lúmenes" required value={formData.lumens} onChange={handleInputChange} className="form-input" />
                        <button type="submit" className="btn-save">Guardar Proyector ✨</button>
                    </form>
                </div>
            )}

            {/* --- TABLA --- */}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">⚠️ {error}</div>}

            {loading ? (
                <div className="text-center p-10 text-gray-500">⏳ Cargando inventario...</div>
            ) : (
                <div className="table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Serial</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Lúmenes</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectors.length > 0 ? (
                                projectors.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{p.serialNumber}</td>
                                        <td>{p.brand}</td>
                                        <td>{p.model}</td>
                                        <td>{p.lumens} lm</td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={{
                                                    backgroundColor: getStatusColor(p.status),
                                                    color: getStatusTextColor(p.status)
                                                }}
                                            >
                                                {p.status === 'AVAILABLE' ? 'Disponible' : p.status}
                                            </span>
                                        </td>
                                        <td>
                                            {p.status === 'AVAILABLE' ? (
                                                <button 
                                                    onClick={() => handleRequestLoan(p.id)}
                                                    className="btn-loan"
                                                >
                                                    Solicitar ➡️
                                                </button>
                                            ) : (
                                                <span style={{color: '#cbd5e0', fontSize: '12px'}}>No disponible</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>
                                        📭 No hay proyectores registrados.
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