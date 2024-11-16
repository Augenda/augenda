import React, { useState, useEffect } from "react";
import "../Home/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const handleLoginChange = (e) => setLogin(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);

	const [remember, setRemember] = useState(false);

	useEffect(() => {
		// Verifica se existem dados no localStorage e preenche os campos se o usuário optou por lembrar
		const storedLogin = localStorage.getItem("login");
		const storedPassword = localStorage.getItem("password");
		const storedRemember = localStorage.getItem("remember") === "true"; // Armazenado como string

		if (storedRemember) {
			setLogin(storedLogin);
			setPassword(storedPassword);
			setRemember(storedRemember);
		}
	}, []);

	const handleLogin = (e) => {
		e.preventDefault();
		navigate("/dashboard");
		if (remember) {
			localStorage.setItem("login", login);
			localStorage.setItem("password", password);
			localStorage.setItem("remember", "true");
		} else {
			// Limpar dados do localStorage caso a opção "lembrar" não seja marcada
			localStorage.removeItem("login");
			localStorage.removeItem("password");
			localStorage.removeItem("remember");
		}
	};

	const handleCheckboxChange = () => {
		setRemember(!remember);
	};

	return (
		<div className="login-background">
			<div className="login-container">
				<h2>LOGIN</h2>
				<form onSubmit={handleLogin}></form>
				<input
					type="text"
					placeholder="Usuário"
					className="login-input"
					value={login}
					onChange={handleLoginChange}
				/>

				<input
					type="password"
					placeholder="Senha"
					className="password-input"
					value={password}
					onChange={handlePasswordChange}
				/>

				<div className="login-remember">
					<label>
						<input
							type="checkbox"
							checked={remember}
							onChange={handleCheckboxChange}
						/>
						Lembrar-me
					</label>
				</div>
				<button className="login-button" onClick={handleLogin}>
					ENTRAR
				</button>
			</div>
		</div>
	);
}

export default Login;
