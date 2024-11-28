import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddService.css';

const AddService = () => {
	const navigate = useNavigate();
	const handleGoback = () => {
		navigate("/services");
	};
	const [formData, setFormData] = useState({
		description: "",
		price: "",
		status: "active", // Valor padrão
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === "price") {
			// Remove tudo que não for número
			const numericValue = value.replace(/\D/g, "");

			// Formata o valor como moeda
			const formattedValue = numericValue
				? `R$ ${(Number(numericValue) / 100).toFixed(2).replace(".", ",")}`
				: "";

			setFormData({
				...formData,
				[name]: formattedValue,
			});
		} else {
			// Para os outros campos, mantém o comportamento padrão
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
	
		// Remove "R$" do preço antes de enviar
		const sanitizedPrice = formData.price.replace("R$", "").replace(",", ".");
	
		const payload = {
			...formData,
			price: sanitizedPrice, // Garante que o preço está em formato numérico
		};
	
		try {
			const response = await fetch("http://localhost:5000/api/add-service", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
	
			if (response.ok) {
				const data = await response.json();
				alert("Serviço cadastrado com sucesso!");
				navigate("/services"); // Redireciona para a lista de serviços
			} else {
				alert("Erro ao cadastrar o serviço.");
			}
		} catch (error) {
			console.error("Erro na requisição:", error);
			alert("Erro ao cadastrar o serviço.");
		}
	};

	return (
		<div className="add-content">
			<button className="goback-button" onClick={handleGoback}>
				<img src={require("../../assets/But_LogOut.png")} alt="But_Goback" />
				<p>VOLTAR</p>
			</button>
			<h2 className="title">REGISTRO DE SERVIÇO</h2>
			<form className="form-addservice" onSubmit={handleSubmit} encType="multipart/form-data">
				{/* Campo Descrição */}
				<div>
					<label htmlFor="description">Descrição:</label>
					<input
						type="text"
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label htmlFor="price">Valor:</label>
					<input
						type="text"
						id="price"
						name="price"
						value={formData.price} // Exibe o valor formatado
						onChange={handleChange} // Aplica a lógica de formatação
						required
					/>
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
						<option value="active">ATIVO</option>
						<option value="inactive">INATIVO</option>
					</select>
				</div>

				{/* Botão de Enviar */}
				<div>
					<button className="save-button" type="submit">GRAVAR</button>
				</div>
			</form>
		</div>
	);
};

export default AddService;
