import React, { useEffect, useState } from "react";
import Header from "../Templates/Header";
import "./Dashboard.css";

const Dashboard = () => {
	const [data, setData] = useState({
		petsCount: 0,
		pendingAppointments: 0,
		completedAppointments: 0,
		topEmployees: [],
		topPets: [],
	});

	useEffect(() => {
		// Função para buscar os dados
		const fetchData = async () => {
			try {
				const [petsRes, pendingRes, completedRes, employeesRes, petsTopRes] =
					await Promise.all([
						fetch("/pets/count").then((res) => res.json()),
						fetch("/appointments/count?status=pending").then((res) => res.json()),
						fetch("/appointments/count?status=completed").then((res) => res.json()),
						fetch("/employees/top").then((res) => res.json()),
						fetch("/pets/top").then((res) => res.json()),
					]);

				setData({
					petsCount: petsRes.count,
					pendingAppointments: pendingRes.count,
					completedAppointments: completedRes.count,
					topEmployees: employeesRes,
					topPets: petsTopRes,
				});
			} catch (error) {
				console.error("Erro ao buscar dados do dashboard:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="dashboard-content">
			<Header />
			<h1 className="title">DASHBOARD</h1>

			<div className="dashboard-container">
				<div className="card highlights">
					<h3>PETS CADASTRADOS</h3>
					<p>{data.petsCount}</p>
				</div>
				<div className="card highlights">
					<h3>AGENDAMENTOS PENDENTES</h3>
					<p>{data.pendingAppointments}</p>
				</div>
				<div className="card highlights">
					<h3>AGENDAMENTOS CONCLUÍDOS</h3>
					<p>{data.completedAppointments}</p>
				</div>
				<div className="card details">
					<h3>FUNCIONÁRIOS COM MAIS AGENDAMENTOS</h3>
					<ol>
						{data.topEmployees.map((employee, index) => (
							<li key={index}>
								{employee.name} {employee.count}/10
							</li>
						))}
					</ol>
				</div>
				<div className="card details">
					<h3>PETS MAIS FREQUENTES</h3>
					<ol>
						{data.topPets.map((pet, index) => (
							<li key={index}>{pet.name}</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;