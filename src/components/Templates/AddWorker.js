import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AddWorker = () => {
	const navigate = useNavigate();
	const handleGoback = () => {
		navigate("/workers");
	};
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		password: "",
		role: "Usuario", // Valor padrão
		status: "Ativo"
	});
	const [photo, setPhoto] = useState(null); // Estado para armazenar a foto

	// Função para lidar com alterações nos campos do formulário
	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Função para lidar com o upload de foto
	const handlePhotoChange = (event) => {
		const file = event.target.files[0]; // Obtém o arquivo selecionado
		setPhoto(file);
	};

	// Função para lidar com o envio do formulário
	const handleSubmit = async (event) => {
		event.preventDefault();
		const formDataToSend = new FormData(); // Usa FormData para incluir o arquivo no envio

		// Adiciona os dados do formulário
		for (let key in formData) {
			formDataToSend.append(key, formData[key]);
		}

		// Adiciona a foto
		if (photo) {
			formDataToSend.append("photo", photo);
		}
		try {
			// Faz a requisição ao backend
			const response = await fetch("http://localhost:5000/api/add-worker", {
				method: "POST",
				body: formDataToSend,
			});
	
			const data = await response.json();
			if (response.ok) {
				alert("Funcionário adicionado com sucesso!");
				navigate("/workers"); // Redireciona para a página de funcionários
			} else {
				alert(data.error || "Erro ao adicionar funcionário.");
			}
		} catch (error) {
			console.error("Erro ao enviar dados:", error);
			alert("Erro ao conectar ao servidor.");
		}
		
	};

	return (
		
		<div className="add-content">
			<button className="goback-button" onClick={handleGoback}>
				<img src={require("../../assets/But_LogOut.png")} alt="But_Goback" />
				<p>VOLTAR</p>
			</button>
			<h2 className="title">REGISTRO DE FUNCIONÁRIO</h2>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				{/* Campo Nome */}
				<div>
					<label htmlFor="name">Nome:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo Username */}
				<div>
					<label htmlFor="username">Usuário:</label>
					<input
						type="text"
						id="username"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo Password */}
				<div>
					<label htmlFor="password">Senha:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo Role */}
				<div>
					<label htmlFor="role">Função:</label>
					<select
						id="role"
						name="role"
						value={formData.role}
						onChange={handleChange}
						required
					>
						<option value="Administrador">ADMINISTRADOR</option>
						<option value="Usuario">USUÁRIO</option>
					</select>
				</div>

				{/* Campo Status */}
				<div>
					<label htmlFor="status">Status:</label>
					<select
						id="status"
						name="status"
						value={formData.status}
						onChange={handleChange}
						required
					>
						<option value="Ativo">ATIVO</option>
						<option value="Inativo">INATIVO</option>
					</select>
				</div>

				{/* Campo Foto */}
				<div>
					<label htmlFor="photo">Foto:</label>
					<input
						type="file"
						id="photo"
						name="photo"
						accept="image/*"
						onChange={handlePhotoChange}
					/>
				</div>

				{photo && (
					<div>
						<img
							src={URL.createObjectURL(photo)}
							alt="Foto do Funcionário"
							style={{ width: "100px", height: "100px", objectFit: "cover" }}
						/>
					</div>
				)}

				{/* Botão de Enviar */}
				<div>
					<button className="save-button" type="submit">GRAVAR</button>
				</div>
			</form>
		</div>
	);
};

export default AddWorker;

		// Exemplo de envio dos dados para o servidor !!!!!!!!! ATENÇÃO EDUARDO !!!!!!!
		// fetch("/api/employees", {
		// 	method: "POST",
		// 	body: formDataToSend,
		// })
		// 	.then((response) => {
		// 		if (response.ok) {
		// 			alert("Funcionário registrado com sucesso!");
		// 		} else {
		// 			alert("Erro ao registrar o funcionário!");
		// 		}
		// 	})
		// 	.catch((error) => console.error("Erro:", error)); 