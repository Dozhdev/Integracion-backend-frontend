import React, { useState, useEffect } from 'react';
import './styles/GaugeStyles.css';

const StepsCounter = () => {
  const [steps, setSteps] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    const ws = new WebSocket('ws://20.253.229.234:8080');

    ws.onopen = () => {
      setConnectionStatus('connected');
      console.log('Conexión WebSocket establecida para pasos');
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        // Extrae específicamente el valor de pasos del JSON
        if (data && typeof data.pasos === 'number') {
          setSteps(data.pasos);
        }
      } catch (error) {
        console.error('Error procesando datos de pasos:', error);
      }
    };

    ws.onerror = () => setConnectionStatus('error');
    ws.onclose = () => setConnectionStatus('disconnected');

    return () => ws.close();
  }, []);

  return (
    <div className="gauge-slide">
      <h2 className="slide-title">CONTADOR DE PASOS</h2>
      <div className="steps-container-wrapper">
        <div className="steps-circle">
          <div className="steps-text">{steps}</div>
        </div>
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === 'connected' && '● CONECTADO'}
          {connectionStatus === 'error' && '● ERROR'}
          {connectionStatus === 'disconnected' && '● DESCONECTADO'}
        </div>
      </div>
    </div>
  );
};

export default StepsCounter;