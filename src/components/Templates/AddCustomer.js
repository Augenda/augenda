import React, { useState, useEffect } from "react";
import "./AddCustomer.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"; //Import que permite que a data seja formatada corretamente antes de ser inserida no banco de dados!!!

const AddCustomer = () => {
	const navigate = useNavigate();
	const handleGoback = () => {
		navigate("/customers");
	};

	const [cidades, setCidades] = useState([]);
	const [cidadeSelecionada, setCidadeSelecionada] = useState("");

	const [ufs, setUFs] = useState([]);
	const [ufSelecionada, setUFSelecionada] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		cpf: "",
		birth_date: null,
		status: "active",
		address: "",
		ref: "",
		street: "",
		city: "",
		state: "",
	});
	const [photo, setPhoto] = useState(null); // Estado para armazenar a foto

	// Função para lidar com alterações nos campos do formulário
	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});

		setCidadeSelecionada(event.target.value);
		setUFSelecionada(event.target.value);
	};

    const handleDateChange = (date) => {
		const formattedDate = format(date, "yyyy-MM-dd"); // Formata para o formato que o MySQL aceita
		setFormData({ ...formData, birth_date: formattedDate });
	  };

	//FUNÇÃO PRA PEGAR A LISTA DE CIDADES
	useEffect(() => {
		fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
			.then((response) => response.json())
			.then((data) => {
				const cidadesFormatadas = data.map((cidade) => ({
					value: cidade.id,
					label: cidade.nome,
				}));
				setCidades(cidadesFormatadas);
			})
			.catch((error) => console.error("Erro ao buscar cidades:", error));
	}, []);

	//FUNÇÃO PRA PEGAR A LISTA DE UFs
	useEffect(() => {
		fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
			.then((response) => response.json())
			.then((data) => {
				const ufsFormatadas = data.map((uf) => ({
					value: uf.sigla,
					label: uf.nome,
				}));
				setUFs(ufsFormatadas);
			})
			.catch((error) => console.error("Erro ao buscar UFs:", error));
	}, []);

	// Função para lidar com o upload de foto
	const handlePhotoChange = (event) => {
		const file = event.target.files[0]; // Obtém o arquivo selecionado
		setPhoto(file);
	};

	// Função para lidar com o envio do formulário
	const handleSubmit = async (event) => {
		event.preventDefault();
	
		const formDataToSend = new FormData();
	
		// Adiciona dados do formulário
		for (let key in formData) {
			formDataToSend.append(key, formData[key]);
		}
	
		// Adiciona foto, se houver
		if (photo) {
			formDataToSend.append("photo", photo);
		}
	
		try {
			const response = await fetch("http://localhost:5000/api/add-customer", {
				method: "POST",
				body: formDataToSend,
			});
	
			const data = await response.json();
			if (response.ok) {
				alert("Cliente adicionado com sucesso!");
				navigate("/customers"); // Redireciona para a lista de clientes
			} else {
				alert(data.error || "Erro ao adicionar cliente.");
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
			<h2 className="title">Registro de cliente</h2>
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

				{/* Campo Telefone */}
				<div>
					<label htmlFor="phone">Telefone:</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo CPF */}
				<div>
					<label htmlFor="cpf">CPF:</label>
					<InputMask
						mask="999.999.999-99"
						value={formData.cpf}
						onChange={handleChange}
						required
					>
						{(inputProps) => (
							<input {...inputProps} type="text" id="cpf" name="cpf" />
						)}
					</InputMask>
				</div>

				{/* Campo Data Nsc */}
				<div>
					<label htmlFor="nascimento">Data de Nascimento:</label>
					<DatePicker
						id="birth_date"
						selected={formData.birth_date}
						onChange={handleDateChange}
						dateFormat="dd/MM/yyyy"
						placeholderText="Selecione sua data de nascimento"
						maxDate={new Date()} // Não permite datas futuras
                        minDate={new Date(1950, 0, 1)}
						showYearDropdown // Exibe dropdown de anos
						scrollableYearDropdown // Permite rolagem no dropdown de anos
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

				{/* Campo Endereço */}
				<div>
					<label htmlFor="adress">Endereço:</label>
					<input
						type="text"
						id="adress"
						name="adress"
						value={formData.adress}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Campo Ponto de referência */}
				<div>
					<label htmlFor="ref">Ponto de referência:</label>
					<input
						type="text"
						id="ref"
						name="ref"
						value={formData.ref}
						onChange={handleChange}
					/>
				</div>

				{/* Campo Cidade */}
				<div>
					<label htmlFor="city">Selecione sua cidade:</label>
					<select
						id="city"
						name="city"
						value={cidadeSelecionada}
						onChange={handleChange}
						required
					>
						<option value="" disabled>Escolha sua cidade:</option>
						{cidades.map((city) => (
							<option key={city.value} value={city.value}>
								{city.label}
							</option>
						))}
					</select>
				</div>

				{/* Campo State */}
				<div>
					<label htmlFor="state">Selecione seu estado (UF):</label>
					<select 
                    id="state"
                    name="state"
                    value={ufSelecionada}
                    onChange={handleChange}
                    required
                    >
						<option value="" disabled>Escolha um estado:</option>
						{ufs.map((uf) => (
							<option key={uf.value} value={uf.value}>
								{uf.label}
							</option>
						))}
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

export default AddCustomer;
