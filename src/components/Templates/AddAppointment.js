import React, { useState, useEffect } from "react";
import "./AddAppointment.css";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const AddAppointment = () => {
	const navigate = useNavigate();

	const handleGoback = () => {
		navigate("/appointments");
	};

	// Estados
	const [formData, setFormData] = useState({
		worker: "",
		service: "",
		pet: "",
		dt_ini: null,
		dt_prev: null,
		dt_complete: null,
	});
	const [services, setServices] = useState([]); // Estado para armazenar os serviços
	const [user, setUsers] = useState([]); // Estado para armazenar os serviços
	const [pets, setPets] = useState([]); // Estado para armazenar os serviços

	// Buscar serviços ao carregar o componente
	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/services"); // Substitua pela rota correta da API
				if (response.ok) {
					const data = await response.json();
					setServices(data); // Define os serviços no estado
				} else {
					console.error("Erro ao buscar serviços:", response.statusText);
				}
			} catch (error) {
				console.error("Erro na conexão com a API:", error);
			}
		};
		fetchServices();
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/workers"); // Substitua pela rota correta da API
				if (response.ok) {
					const data = await response.json();
					setUsers(data); // Define os serviços no estado
				} else {
					console.error("Erro ao buscar funcionários:", response.statusText);
				}
			} catch (error) {
				console.error("Erro na conexão com a API:", error);
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchPets = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/pets"); // Substitua pela rota correta da API
				if (response.ok) {
					const data = await response.json();
					setPets(data); // Define os serviços no estado
				} else {
					console.error("Erro ao buscar pets:", response.statusText);
				}
			} catch (error) {
				console.error("Erro na conexão com a API:", error);
			}
		};
		fetchPets();
	}, []);

	// Atualizar estado do formulário
	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleDateChange = (date, field) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        setFormData({
          ...formData,
          [field]: formattedDate, // Atualiza o campo específico (dt_ini, dt_prev, ou dt_complete)
        });
      };      

	// Enviar dados do formulário
	const handleSubmit = async (event) => {
		event.preventDefault();

		const formDataToSend = new FormData();
		for (let key in formData) {
			formDataToSend.append(key, formData[key]);
		}

		try {
			const response = await fetch(
				"http://localhost:5000/api/add-appointment",
				{
					method: "POST",
					body: formDataToSend,
				}
			);

			const data = await response.json();
			if (response.ok) {
				alert("Agendamento adicionado com sucesso!");
				navigate("/appointments");
			} else {
				alert(data.error || "Erro ao adicionar agendamento.");
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
			<h2 className="title">Registro de agendamento</h2>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				{/* Campo Funcionário */}
				<div>
					<label htmlFor="worker">Funcionário:</label>
					<select
						id="worker"
						name="worker"
						value={formData.worker}
						onChange={handleChange}
						required
					>
						<option value="" disabled>
							Selecione um funcionário
						</option>
						{user.map((user) => (
							<option key={user.id} value={user.id}>
								{user.name}
							</option>
						))}
					</select>
				</div>

				{/* Campo Serviço */}
				<div>
					<label htmlFor="service">Serviço:</label>
					<select
						id="service"
						name="service"
						value={formData.service}
						onChange={handleChange}
						required
					>
						<option value="" disabled>
							Selecione um serviço
						</option>
						{services.map((service) => (
							<option key={service.id} value={service.id}>
								{service.name}
							</option>
						))}
					</select>
				</div>

				{/* Campo Pet */}
				<div>
					<label htmlFor="pet">Pet:</label>
					<select
						id="pet"
						name="pet"
						value={formData.pet}
						onChange={handleChange}
						required
					>
						<option value="" disabled>
							Selecione um pet
						</option>
						{pets.map((pet) => (
							<option key={pet.id} value={pet.id}>
								{pet.name}
							</option>
						))}
					</select>
				</div>

				{/* Campo Data ini */}
				<div>
					<label htmlFor="dt_ini">Data de inicio:</label>
					<DatePicker
						id="dt_ini"
						selected={formData.dt_ini}
						onChange={(date) => handleDateChange(date, "dt_ini")}
						dateFormat="dd/MM/yyyy"
						placeholderText="Selecione a data de início"
						showYearDropdown
						scrollableYearDropdown
					/>
				</div>

				<div>
					<label htmlFor="dt_prev">Data de previsão de conclusão:</label>
					<DatePicker
						id="dt_prev"
						selected={formData.dt_prev}
						onChange={(date) => handleDateChange(date, "dt_prev")}
						dateFormat="dd/MM/yyyy"
						placeholderText="Selecione a data de previsão"
						showYearDropdown
						scrollableYearDropdown
					/>
				</div>

				<div>
					<label htmlFor="dt_complete">Data de conclusão:</label>
					<DatePicker
						id="dt_complete"
						selected={formData.dt_complete}
						onChange={(date) => handleDateChange(date, "dt_complete")}
						dateFormat="dd/MM/yyyy"
						placeholderText="Selecione a data de conclusão"
						showYearDropdown
						scrollableYearDropdown
					/>
				</div>

				{/* Botão de Enviar */}
				<div>
					<button type="submit">GRAVAR</button>
				</div>
			</form>
		</div>
	);
};

export default AddAppointment;
