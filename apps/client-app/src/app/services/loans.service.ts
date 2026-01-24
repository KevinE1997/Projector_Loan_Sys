import axios from 'axios';
import { CreateLoanDto } from '../../types/inventory.types';

// La URL base (incluye /api/loans)
const API_URL = import.meta.env.API_URL || 'http://plms-gateway-alb-1194092981.us-east-1.elb.amazonaws.com/api';

export const loansService = {
  // 1. Obtener todos los préstamos
  getAllLoans: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/loans`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // 2. Crear préstamo
  createLoan: async (loanData: CreateLoanDto) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/loans`, loanData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // 3. Obtener préstamos (Alias o filtrado)
  getLoans: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/loans`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // 4. Devolver préstamo
  // ¡ESTA ES LA QUE DABA PROBLEMAS! Ahora está DENTRO del objeto.
  returnLoan: async (loanId: string, observations?: string) => {
    const token = localStorage.getItem('token');

    // CORREGIDO: Usamos patch y la URL correcta sin duplicar "/loans"
    // Resultado: http://.../api/loans/{id}/return
    const response = await axios.patch(
      `${API_URL}/${loanId}/return`, 
      { observations },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }

}; // <--- AQUÍ CIERRA EL OBJETO loansService