import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import './styles/ChartComponent.css';

const ChartComponent = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const updateIntervalRef = useRef(null);
  const [currentBpm, setCurrentBpm] = useState(65);

  // Generador de datos de ritmo cardíaco (valores enteros 60-70 BPM)
  const generateHeartRateData = (count) => {
    const data = [];
    let lastValue = 65;
    let lastTime = Date.now() / 1000 - count;

    for (let i = 0; i < count; i++) {
      const time = lastTime + i;
      
      // Variación basada en el último valor
      let variation;
      const randomValue = Math.random();
      
      if (lastValue <= 62) {
        variation = randomValue > 0.3 ? 1 : 0;
      } else if (lastValue >= 68) {
        variation = randomValue > 0.3 ? -1 : 0;
      } else {
        variation = randomValue > 0.6 ? 1 : randomValue > 0.3 ? -1 : 0;
      }

      // Aplicar variación con límites
      const newValue = Math.max(60, Math.min(lastValue + variation, 70));
      data.push({ time, value: newValue });
      lastValue = newValue;
    }

    return data;
  };

  useEffect(() => {
    // Inicialización del gráfico
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: 'transparent',
        textColor: '#ffffff',
        fontFamily: 'Poppins, sans-serif'
      },
      grid: {
        vertLines: { color: 'rgba(100, 181, 246, 0.1)' },
        horzLines: { color: 'rgba(100, 181, 246, 0.1)' }
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.2
        },
        borderVisible: false,
        minimum: 58,
        maximum: 72
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false
      }
    });

    chartRef.current = chart;

    // Crear serie de área
    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(100, 181, 246, 0.4)',
      bottomColor: 'rgba(100, 181, 246, 0)',
      lineColor: 'rgba(100, 181, 246, 1)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (price) => `${Math.round(price)} BPM`
      }
    });

    seriesRef.current = areaSeries;

    // Datos iniciales (últimos 300 puntos = 5 minutos)
    const initialData = generateHeartRateData(300);
    areaSeries.setData(initialData);
    chart.timeScale().fitContent();

    // Actualización en tiempo real
    updateIntervalRef.current = setInterval(() => {
      const time = Date.now() / 1000;
      const lastPoint = seriesRef.current.dataByIndex(-1);
      let lastValue = lastPoint ? lastPoint.value : 65;
      
      // Generar nueva variación (solo enteros)
      const variation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      
      // Aplicar con límites
      const newValue = Math.max(60, Math.min(lastValue + variation, 70));
      setCurrentBpm(newValue);
      
      seriesRef.current.update({ time, value: newValue });
      chart.timeScale().scrollToPosition(1, false);
    }, 1000);

    // Limpieza al desmontar
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="chart-slide">
      <h2 className="slide-title">RITMO CARDÍACO</h2>
      <div className="chart-container-wrapper">
        <div ref={chartContainerRef} className="chart-container" />
      </div>
      <div className="bpm-display">
        {currentBpm} <span className="bpm-unit">BPM</span>
      </div>
    </div>
  );
};

export default ChartComponent;