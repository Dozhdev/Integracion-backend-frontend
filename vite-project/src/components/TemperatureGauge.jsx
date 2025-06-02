import React, { useState, useEffect } from 'react';
import GaugeComponent from 'react-gauge-component';
import './styles/GaugeStyles.css';

const TemperatureGauge = () => {
    const [temperature, setTemperature] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    useEffect(() => {
        const ws = new WebSocket('ws://20.253.229.234:8080');

        ws.onopen = () => {
            setConnectionStatus('connected');
            console.log('Conexión WebSocket establecida');
        };

        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data && typeof data.temperatura === 'number') {
                    setTemperature(parseFloat(data.temperatura.toFixed(1)));
                }
            } catch (error) {
                console.error('Error parseando JSON:', error);
            }
        };

        ws.onerror = () => setConnectionStatus('error');
        ws.onclose = () => setConnectionStatus('disconnected');

        return () => ws.close();
    }, []);

    return (
        <div className="gauge-slide">
            <h2 className="slide-title">TEMPERATURA</h2>
            <div className="temperature-container-wrapper">
                <GaugeComponent
                    type="radial"
                    arc={{
                        colorArray: ['#00FF15', '#FF2121'],
                        subArcs: [
                            { limit: 15, color: '#5B8DF5', showTick: true },
                            { limit: 20, color: '#5BAAFF', showTick: true },
                            { limit: 25, color: '#5BE12C', showTick: true },
                            { limit: 30, color: '#FFD700', showTick: true },
                            { limit: 35, color: '#FF2121', showTick: true }
                        ],
                        padding: 0.02
                    }}
                    pointer={{
                        color: '#64b5f6',
                        length: 0.85,
                        width: 0.25,
                        elastic: true,
                        animationDuration: 1000,
                        style: {
                            filter: 'drop-shadow(0 0 6px rgba(100, 181, 246, 1)) drop-shadow(0 0 3px white)',
                            stroke: 'white',
                            strokeWidth: '2px'
                        }
                    }}
                    labels={{
                        valueLabel: {
                            formatTextValue: value => `${value.toFixed(1)}°C`,
                            style: { fontSize: '28px', fill: '#fff' }
                        },
                        tickLabels: {
                            type: 'outer',
                            defaultTickValueConfig: {
                                formatTextValue: value => `${value}°C`,
                                style: { fill: '#fff' }
                            }
                        }
                    }}
                    value={temperature}
                    minValue={15}
                    maxValue={35}
                    animDelay={0}
                />
                <div className={`connection-status ${connectionStatus}`}>
                    {connectionStatus === 'connected' && '● CONECTADO'}
                    {connectionStatus === 'error' && '● ERROR'}
                    {connectionStatus === 'disconnected' && '● DESCONECTADO'}
                </div>
            </div>
        </div>
    );
};

export default TemperatureGauge;