import React from "react";
import "./Header.css";
import { useNavigate } from 'react-router-dom';


function Header() {
  const navigate = useNavigate();
      
      const handleLogin = () => {
        // Redireciona para a página desejada sem validação
        navigate('/'); 
      };
  const saudacaoPorHorario = () => {
    const horaBrasilia = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    const hora = new Date(horaBrasilia).getHours();
    if (hora >= 6 && hora < 12) {
      return "Bom dia,";
    } else if (hora >= 12 && hora < 18) {
      return "Boa tarde,";
    } else {
      return "Boa noite,";
    }
  };

  return (
    <div className="header">
      <button className="logout-button" onClick={handleLogin}>
        <img
          src={require("../../assets/But_LogOut.png")}
          alt="Sair"
          className="logout-icon"
        />
        <span className="logout-text">SAIR</span>
      </button>

      <div className="profile-container">
        <div className="profile">
        <img
          src={require("../../assets/Profile.jpg")}
          alt="Foto de Perfil"
          className="profile-pic"
        />
        </div>
        <p className="greetings">{saudacaoPorHorario()}</p>
        <span className="username">USER!</span>
      </div>

      <div className="buttons">
        <a href="/dashboard" className="button-dash">
          DASHBOARD
        </a>
        <a href="/menu" className="button-menu">
          MENU
        </a>
      </div>
    </div>
  );
}

export default Header;


