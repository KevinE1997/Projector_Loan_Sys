import axios from 'axios';
import { CreateProjectorDto, Projector } from '../../types/inventory.types';

const API_URL = import.meta.env.API_URL || 'http://plms-gateway-alb-1194092981.us-east-1.elb.amazonaws.com/api';

// Helper para el token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { 
    headers: { Authorization: `Bearer ${token}` } 
  };
};

export const inventoryService = {
  // GET: Obtener todos
  getAllProjectors: async (): Promise<Projector[]> => {
    // Apuntamos a /api/inventory + /projectors (del controlador)
    const response = await axios.get<Projector[]>(
      `${API_URL}/api/projectors`, 
      getAuthHeader()
    );
    return response.data;
  },

  // POST: Crear uno nuevo
  createProjector: async (projector: CreateProjectorDto): Promise<Projector> => {
    const response = await axios.post<Projector>(
      `${API_URL}/api/projectors`,
      projector,
      getAuthHeader()
    );
    return response.data;
  },

  // GET: Obtener uno por ID (Opcional, pero tu controlador lo tiene)
  getProjectorById: async (id: string): Promise<Projector> => {
    const response = await axios.get<Projector>(
      `${API_URL}/api/projectors/${id}`,
      getAuthHeader()
    );
    return response.data;
  }
};