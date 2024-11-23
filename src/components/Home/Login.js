import React, { useState, useEffect } from "react";
import "../Home/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(""); // Para exibir mensagens de erro

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

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: login, password }),
			});

			const data = await response.json();

			if (response.ok) {
				if (remember) {
					localStorage.setItem("login", login);
					localStorage.setItem("password", password);
					localStorage.setItem("remember", "true");
				} else {
					localStorage.removeItem("login");
					localStorage.removeItem("password");
					localStorage.removeItem("remember");
				}
				navigate("/dashboard");
			} else {
				setErrorMessage(data.error || "Erro ao fazer login");
			}
		} catch (error) {
			setErrorMessage("Erro ao conectar ao servidor");
		}
	};

	const handleCheckboxChange = () => {
		setRemember(!remember);
	};

	return (
		<div className="login-background">
			<div className="login-container">
				<h2>LOGIN</h2>
				{/* Alterei o formulário para usar o onSubmit para chamar handleLogin */}
				<form onSubmit={handleLogin}>
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
					{/* Exibir mensagem de erro */}
					{errorMessage && <p className="error-message">{errorMessage}</p>}

					{/* O botão agora tem o tipo "submit" */}
					{/* <button className="login-button" type="submit">
						ENTRAR
					</button> */}

					<a className="login-button" href="/dashboard">
						ENTRAR
					</a>
					
				</form>
			</div>
		</div>
	);
}

export default Login;
