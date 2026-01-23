import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventory.service';
import { Projector, CreateProjectorDto, ProjectorStatus } from '../../types/inventory.types';

export const InventoryPage = () => {
  // Estado para la lista
  const [projectors, setProjectors] = useState<Projector[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para el formulario
  const [formData, setFormData] = useState<CreateProjectorDto>({
    serialNumber: '',
    brand: '',
    model: '',
    lumens: 3000 // Valor por defecto
  });

  // Cargar datos al iniciar
  useEffect(() => {
    loadProjectors();
  }, []);

  const loadProjectors = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getAllProjectors();
      setProjectors(data);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar inventario. Revisa la consola.');
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
      // IMPORTANTE: Asegurar que lumens sea número
      const payload = {
        ...formData,
        lumens: Number(formData.lumens)
      };
      
      await inventoryService.createProjector(payload);
      
      // Limpiar formulario y recargar tabla
      setFormData({ serialNumber: '', brand: '', model: '', lumens: 3000 });
      alert('¡Proyector creado con éxito!');
      loadProjectors();
      
    } catch (err: any) {
      console.error(err);
      alert('Error al crear: ' + (err.response?.data?.message || err.message));
    }
  };

  // Función para dar color al estado
  const getStatusColor = (status: ProjectorStatus) => {
    switch (status) {
      case ProjectorStatus.AVAILABLE: return 'green';
      case ProjectorStatus.LOANED: return 'orange';
      case ProjectorStatus.MAINTENANCE: return 'red';
      default: return 'black';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📽️ Gestión de Proyectores</h2>
      
      {/* --- FORMULARIO DE CREACIÓN --- */}
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Agregar Nuevo</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <input 
            name="serialNumber" placeholder="Número de Serie" required 
            value={formData.serialNumber} onChange={handleInputChange} 
          />
          <input 
            name="brand" placeholder="Marca (ej: Epson)" required 
            value={formData.brand} onChange={handleInputChange} 
          />
          <input 
            name="model" placeholder="Modelo" required 
            value={formData.model} onChange={handleInputChange} 
          />
          <input 
            name="lumens" type="number" placeholder="Lúmenes" required 
            value={formData.lumens} onChange={handleInputChange} 
          />
          
          <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', cursor: 'pointer' }}>
            Guardar Proyector
          </button>
        </form>
      </div>

      {/* --- LISTA DE PROYECTORES --- */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
          <thead style={{ background: '#eee' }}>
            <tr>
              <th>Serial</th>
              <th>Marca / Modelo</th>
              <th>Lúmenes</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {projectors.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '8px' }}>{p.serialNumber}</td>
                <td style={{ padding: '8px' }}>{p.brand} {p.model}</td>
                <td style={{ padding: '8px' }}>{p.lumens}</td>
                <td style={{ padding: '8px', fontWeight: 'bold', color: getStatusColor(p.status) }}>
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};