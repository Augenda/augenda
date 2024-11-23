import React from "react";
import Header from "../Templates/Header";
import "./Dashboard.css";

const Dashboard = () => {
	return (
		<div className="dashboard-content">
			<Header />
			<h1 className="title">DASHBOARD</h1>

			<div className="dashboard-container">
				<div className="card highlights">
					<h3>PETS CADASTRADOS</h3>
					<p>29</p>
				</div>
				<div className="card highlights">
					<h3>AGENDAMENTOS PENDENTES</h3>
					<p>29</p>
				</div>
				<div className="card highlights">
					<h3>AGENDAMENTOS CONCLUÍDOS</h3>
					<p>29</p>
				</div>
				<div className="card details">
					<h3>FUNCIONÁRIOS COM MAIS AGENDAMENTOS</h3>
					<ol>
						<li>Eduardo 5/10</li>
						<li>Stefany 3/10</li>
						<li>Myrths 1/10</li>
						<li>Mayan 1/10</li>
					</ol>
				</div>
				<div className="card details">
					<h3>PETS MAIS FREQUENTES</h3>
					<ol>
						<li>Miko</li>
						<li>FraJola</li>
						<li>Pepe</li>
						<li>Samir</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
