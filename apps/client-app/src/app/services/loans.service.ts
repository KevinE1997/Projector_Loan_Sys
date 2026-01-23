import axios from 'axios';
import { CreateLoanDto } from '../../types/inventory.types';
// La URL que configuramos en Nginx (Gateway Cuenta 1)
const API_URL = 'http://plms-gateway-alb-1194092981.us-east-1.elb.amazonaws.com/api/loans';

export const loansService = {
  // Obtener todos los préstamos realizados
  getAllLoans: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Crear un nuevo préstamo
  createLoan: async (loanData: CreateLoanDto) => {
    const token = localStorage.getItem('token');

    console.log("Token enviado a Loans:", token);

    const response = await axios.post(`${API_URL}`, loanData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Finalizar un préstamo (devolución)
  returnProjector: async (loanId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/${loanId}/return`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};