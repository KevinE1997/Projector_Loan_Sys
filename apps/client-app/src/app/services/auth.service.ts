import axios from 'axios';

// URL de tu Gateway / Load Balancer en AWS
const API_URL = 'http://plms-gateway-alb-1194092981.us-east-1.elb.amazonaws.com/api';

export const authService = {
  
  // 1. LOGIN (Modificado para guardar el Rol)
  login: async (email: string, password: string) => {
    
    try {
      // Limpiamos cualquier sesión previa por seguridad
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log("📦 Respuesta del Backend:", response.data);
      // Buscamos el token y el rol en la respuesta
      // NOTA: Asegúrate de que tu Backend devuelva el rol. 
      // Si tu backend devuelve el rol dentro de un objeto 'user', usa response.data.user.role
      const token = response.data.token || response.data.access_token;
      const role = response.data.role || response.data.user?.role || 'user'; // 'user' por defecto si no viene nada

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // <--- ¡IMPORTANTE! Guardamos el rol
      } else {
        console.error("No se encontró el token en la respuesta:", response.data);
      }

      return response.data;
    } catch (error: any) {
      console.error("Error de Login:", error);
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  },

  // 2. REGISTRO (Nueva función)
  register: async (name: string, email: string, password: string, role: string = 'user') => {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        name,
        email,
        password,
        role // Enviamos si es 'admin' o 'user'
      });
      return response.data;
    } catch (error: any) {
      console.error("Error de Registro:", error);
      throw error.response ? error.response.data : new Error('Error de conexión');
    }
  },

  // 3. LOGOUT (Limpieza total)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // También borramos el rol
  },

  // Helper para verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Helper para obtener el rol actual
  getRole: () => {
    return localStorage.getItem('role');
  }
};