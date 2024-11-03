import React from "react";
import "../Login/Login.css";

function Login() {
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
				<button className="login-button">ENTRAR</button>
			</div>
		</div>
	);
}

export default Login;
