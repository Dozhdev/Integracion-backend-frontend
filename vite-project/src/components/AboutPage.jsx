import React from 'react';
import TuFotoOriginal from '../assets/team/Jorge.jpg';
import ColegaFotoOriginal from '../assets/team/Alex.jpg';
import './styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">NUESTRO EQUIPO</h1>
      
      <div className="team-members">
        <div className="team-member">
          <div className="photo-container">
            <img 
              src={TuFotoOriginal} 
              alt="Jorge Guerra" 
              className="original-photo"
              loading="lazy"
            />
          </div>
          <p className="member-name">Jorge Guerra</p>
          <p className="member-role">Frontend Developer</p>
        </div>
        
        <div className="team-member">
          <div className="photo-container">
            <img 
              src={ColegaFotoOriginal} 
              alt="Alex Espinel" 
              className="original-photo"
              loading="lazy"
            />
          </div>
          <p className="member-name">Alex Espinel</p>
          <p className="member-role">Backend Developer</p>
        </div>
      </div>

      <div className="team-footer">
        <p>Creado con <span className="heart">❤️</span> por <span className="team-name">Axioma Team</span></p>
      </div>
    </div>
  );
};

export default AboutPage;