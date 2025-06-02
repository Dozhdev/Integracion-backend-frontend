import React from 'react';
import './styles/ProjectPage.css';

const ProjectPage = () => {
  return (
    <div className="project-container">
      <h1 className="project-title">INFORMACIÓN DEL PROYECTO</h1>
      
      <div className="project-content">
        <div className="project-card">
          <h2>Objetivo</h2>
          <p>Este proyecto fue desarrollado para mostrar datos en tiempo real mediante gráficos interactivos y medidores visuales.</p>
        </div>
        
        <div className="project-card">
          <h2>Tecnologías</h2>
          <ul>
            <li>React</li>
            <li>Vite</li>
            <li>Lightweight Charts</li>
            <li>React Gauge Component</li>
            <li>Swiper</li>
          </ul>
        </div>
        
        <div className="project-card">
          <h2>Características</h2>
          <ul>
            <li>Gráficos en tiempo real</li>
            <li>Visualización de métricas</li>
            <li>Diseño responsive</li>
            <li>Interfaz intuitiva</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;