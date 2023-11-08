//Importaciones obligatorias de REACT
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

//Importar assets (recursos, hojas de estilos, imágenes)
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css';
import './assets/css/styles.css';
import './assets/css/responsive.css';

//Arrancar app de react
ReactDOM.createRoot(document.getElementById('root')).render(
  
    <App />
  
)
