import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Limpa o LocalStorage no logout
        navigate('/'); 
    };

    const username = localStorage.getItem('username'); // Busca o nome do usuário
    const profileImage = localStorage.getItem('profileImage'); // Base64 armazenado no LocalStorage

    const saudacaoPorHorario = () => {
        const hora = new Date().getHours();  
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
          <button className="logout-button" onClick={handleLogout}>
              <img
                  src={require("../../assets/But_LogOut.png")}
                  alt="Sair"
                  className="logout-icon"
              />
              <span className="logout-text">SAIR</span>
          </button>

          <div className="profile-container">
              <div className="profile">
                  {profileImage ? (
                      <img
                          src={profileImage} // Adiciona o prefixo Base64
                          alt="Foto de Perfil"
                          className="profile-pic"
                      />
                  ) : (
                      <img
                          src={require("../../assets/Profile.jpg")}
                          alt="Foto de Perfil Padrão"
                          className="profile-pic"
                      />
                  )}
              </div>
              <p className="greetings">{saudacaoPorHorario()}</p>
              <span className="username">{username || "Usuário"}</span>
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
};

export default Header;
