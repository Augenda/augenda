import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import "./SearchAppointments.css";
import Header from "./Header";

const SearchAppointments = () => {
	const [appointments, setAppointments] = useState([]);
	const [openAppointments, setOpenAppointments] = useState([]);
	const [completedAppointments, setCompletedAppointments] = useState([]);

	// Função para marcar o agendamento como concluído
	const markAsCompleted = (id) => {
		fetch(`http://localhost:5000/api/appointments/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				dt_completed: new Date().toISOString(), // Marca a data atual como data de conclusão
			}),
		})
			.then((response) => response.json())
			.then(() => {
				// Atualiza o estado para refletir a mudança
				setAppointments((prevAppointments) =>
					prevAppointments.map((appointment) =>
						appointment.id === id
							? { ...appointment, dt_completed: new Date().toISOString() }
							: appointment
					)
				);
			})
			.catch((error) => console.error("Erro ao atualizar agendamento:", error));
	};

	useEffect(() => {
		// Fazendo a requisição para buscar os dados
		fetch("http://localhost:5000/api/appointments")
			.then((response) => response.json())
			.then((data) => {
				setAppointments(data);
				// Filtra os agendamentos
				setOpenAppointments(
					data.filter((appointment) => !appointment.dt_completed)
				);
				setCompletedAppointments(
					data.filter((appointment) => appointment.dt_completed)
				);
			})
			.catch((error) => console.error("Erro ao carregar agendamentos:", error));
	}, []);

	return (
		<div>
			<Header />

			<div className="search-appointments">
				<h2 className="title">AGENDAMENTOS</h2>
				<div className="appointments-columns">
					{/* Agendamentos em aberto */}
					<div className="appointments-column">
						<h3 className="subtitle">Agendamentos em Aberto</h3>
						{openAppointments.map((appointment) => (
							<div key={appointment.id} className="appointment-item">
								<div className="container-appointment">
									<strong>{appointment.employee}</strong>
									<p>{appointment.service}</p>
									<p>{appointment.pet}</p>
									<p>{appointment.dt_ini}</p>
									<p>{appointment.dt_prev}</p>
									<button onClick={() => markAsCompleted(appointment.id)}>
										Concluir Agendamento
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Agendamentos concluídos */}
					<div className="appointments-column">
						<h3 className="subtitle	">Agendamentos Concluídos</h3>
						{completedAppointments.map((appointment) => (
							<div key={appointment.id} className="appointment-item">
								<div className="container-appointment">
									<strong>{appointment.employee}</strong>
									<p>{appointment.service}</p>
									<p>{appointment.pet}</p>
									<p>{appointment.dt_ini}</p>
									<p>{appointment.dt_prev}</p>
									<p>{appointment.dt_completed}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchAppointments;
