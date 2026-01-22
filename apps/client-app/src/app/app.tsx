// apps/client-app/src/app/app.tsx
import { LoginPage } from './pages/LoginPage';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Creamos un tema base (podemos personalizar colores aquí)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Azul estándar
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline resetea los estilos del navegador para que se vea igual en todos */}
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;