import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import ChartComponent from './ChartComponent';
import TemperatureGauge from './TemperatureGauge';
import StepsCounter from './StepsCounter';
import './styles/SwiperComponent.css';

const SwiperComponent = () => {
  const [remainingTime, setRemainingTime] = useState(45);
  const [isLocked, setIsLocked] = useState(false);
  const swiperRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (!swiperInstance) return;

    const startTimer = () => {
      // No iniciar si está bloqueado
      if (isLocked) return;
      
      clearInterval(timerRef.current);
      setRemainingTime(45);
      
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // No cambiar de slide si está bloqueado
            if (!isLocked) {
              swiperInstance.slideNext();
            }
            return 45;
          }
          return prev - 1;
        });
      }, 1000);
    };

    swiperInstance.on('slideChange', startTimer);
    
    // Solo iniciar timer si no está bloqueado
    if (!isLocked) {
      startTimer();
    }

    return () => {
      clearInterval(timerRef.current);
      swiperInstance.off('slideChange', startTimer);
    };
  }, [isLocked]);

  const handleLockToggle = () => {
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    
    if (newLockedState) {
      // Si se bloquea, detener el timer
      clearInterval(timerRef.current);
    } else {
      // Si se desbloquea, reiniciar el timer
      const swiperInstance = swiperRef.current?.swiper;
      if (swiperInstance) {
        setRemainingTime(45);
        timerRef.current = setInterval(() => {
          setRemainingTime(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              swiperInstance.slideNext();
              return 45;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  const progress = ((45 - remainingTime) / 45) * 100;

  return (
    <div className="swiper-container">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={false} // Desactivamos el autoplay de Swiper para controlarlo manualmente
        pagination={{
          clickable: !isLocked, // Deshabilitar paginación cuando está bloqueado
          el: '.custom-pagination',
          type: 'bullets'
        }}
        allowTouchMove={!isLocked} // Deshabilitar arrastre cuando está bloqueado
      >
        <SwiperSlide>
          <ChartComponent />
        </SwiperSlide>
        <SwiperSlide>
          <TemperatureGauge />
        </SwiperSlide>
        <SwiperSlide>
          <StepsCounter />
        </SwiperSlide>
      </Swiper>
      
      <div className="navigation-container">
        <div className="custom-pagination"></div>
        <div 
          className={`progress-circle-container ${isLocked ? 'locked' : ''}`}
          onClick={handleLockToggle}
        >
          <svg className="progress-circle" viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle-fg"
              strokeDasharray={`${isLocked ? 100 : progress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="progress-text">
            {isLocked ? <FaLock size={20} /> : `${remainingTime}s`}
          </div>
          <div className="lock-indicator">
            {isLocked ? <FaLock size={12} /> : <FaLockOpen size={12} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwiperComponent;