import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* AQUÍ NO DEBE HABER BROWSERROUTER */}
    <App />  
    {/* EL BROWSERROUTER YA ESTÁ ADENTRO DE APP */}
  </React.StrictMode>,
)