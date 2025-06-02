import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SwiperComponent from './components/SwiperComponent';
import AboutPage from './components/AboutPage';
import ProjectPage from './components/ProjectPage';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<SwiperComponent />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;