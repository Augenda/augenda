import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

	// Função para lidar com o envio do formulário
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Converte o preço para formato numérico antes de enviar
		const formDataToSend = new FormData();
		for (let key in formData) {
			if (key === "price") {
				// Remove "R$" e converte para número
				formDataToSend.append(
					key,
					formData[key].replace("R$", "").replace(",", ".")
				);
			} else {
				formDataToSend.append(key, formData[key]);
			}
		}

		console.log(
			"Dados a serem enviados:",
			Object.fromEntries(formDataToSend.entries())
		);
	};

	return (
		<div className="add-content">
			<button className="form-buttons" onClick={handleGoback}>
				<img src={require("../../assets/But_LogOut.png")} alt="But_Goback" />
				<p>VOLTAR</p>
			</button>
			<h2 className="title">Registro de Serviço</h2>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
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
					<button type="submit">GRAVAR</button>
				</div>
			</form>
		</div>
	);
};

export default AddService;
