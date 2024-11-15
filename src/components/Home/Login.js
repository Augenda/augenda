import React from "react";
import "../Home/Login.css";
import { useNavigate } from 'react-router-dom';


function Login() {
		const navigate = useNavigate();
	  
		const handleLogin = () => {
		  // Redireciona para a página desejada sem validação
		  navigate('/dashboard'); 
		};
	  
		return (
		  <div className="login-background">
			<div className="login-container">
			  <h2>LOGIN</h2>
			  <input type="text" placeholder="Usuário" className="login-input" />
			  <input type="password" placeholder="Senha" className="login-input" />
			  <div className="login-remember">
				<input type="checkbox" id="remember" />
				<label htmlFor="remember">Lembre-se de mim</label>
			  </div>
			  <button className="login-button" onClick={handleLogin}>
				ENTRAR
			  </button>
			</div>
		  </div>
		);
}

export default Login;
