// apps/client-app/src/app/services/auth.service.ts
import axios from 'axios';

// Si pruebas en Android Emulador usa 'http://10.0.2.2:3000'
// Si es Web/Electron usa 'http://localhost:3000'
// Si es AWS usa la IP pública de tu Load Balancer o EC2
const API_URL = 'http://plms-gateway-alb-1194092981.us-east-1.elb.amazonaws.com/api';

export const loginService = async (email: string, password: string) => {
  try {
    localStorage.removeItem('token');
    // Ajusta la ruta '/auth/login' según como definiste tu controlador en NestJS
    const response = await axios.post(`${API_URL}/auth/login`, {
      email, // O username, según tu backend
      password,
    });

    const token = response.data.token || response.data.access_token;

    if (token) {
      localStorage.setItem('token', token);
    } else {
      console.error("No se encontró el token en la respuesta:", response.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("Error de Login:", error);
    throw error.response ? error.response.data : new Error('Error de conexión');
  }
};

export const logoutService = () => {
  localStorage.removeItem('token');
};