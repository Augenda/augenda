import React, { useState } from "react";
import "./AddWorker.css";
import { useNavigate } from 'react-router-dom';

const AddPet = () => {
	const navigate = useNavigate();
	const handleGoback = () => {
		navigate("/pets");
	};
	const [formData, setFormData] = useState({
		name: "",
		breed: "",
		age: "",
		idclient: "",
		type: "dog", // Valor padrão
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
			const response = await fetch("http://localhost:5000/api/add-pet", {
				method: "POST",
				body: formDataToSend,
			});
	
			const data = await response.json();
			if (response.ok) {
				alert("Pet adicionado com sucesso!");
				navigate("/pets"); // Redireciona para a página de funcionários
			} else {
				alert(data.error || "Erro ao adicionar Pet.");
			}
		} catch (error) {
			console.error("Erro ao enviar dados:", error);
			alert("Erro ao conectar ao servidor.");
		}
		
	};

	return (
		
		<div className="add-content">
			<button className="form-buttons" onClick={handleGoback}>
				<img src={require("../../assets/But_LogOut.png")} alt="But_Goback" />
				<p>VOLTAR</p>
			</button>
			<h2 className="title">Registro de Pet</h2>
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

				{/* Campo Raça */}
				<div>
					<label htmlFor="breed">Raça:</label>
					<input
						type="text"
						id="breed"
						name="breed"
						value={formData.breed}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo Cliente */}
				<div>
					<label htmlFor="idclient">Dono(Cliente):</label>
					<input
						type="number"
						min = "1"
						id="idclient"
						name="idclient"
						value={formData.idclient}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo Tipo */}
				<div>
					<label htmlFor="age">Idade:</label>
					<select
						id="age"
						name="age"
						value={formData.age}
						onChange={handleChange}
						required
					>
						<option value="menos">MENOS QUE 4 MESES</option>
						<option value="4 a 6 meses">4 - 6 MESES</option>
						<option value="7 a 12 meses">7 a 12 MESES</option>
						<option value="1 a 2 anos">1 a 2 ANOS</option>
						<option value="3 a 4 anos">3 a 4 ANOS</option>
						<option value="5 a 6 anos">5 a 6 ANOS</option>
						<option value="mais">MAIS QUE 6 ANOS</option>
					</select>
				</div>

				{/* Campo Tipo */}
				<div>
					<label htmlFor="type">Tipo:</label>
					<select
						id="type"
						name="type"
						value={formData.type}
						onChange={handleChange}
						required
					>
						<option value="dog">CACHORRO</option>
						<option value="cat">GATO</option>
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
					<button type="submit">GRAVAR</button>
				</div>
			</form>
		</div>
	);
};

export default AddPet;

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