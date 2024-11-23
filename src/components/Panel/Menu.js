import React from "react";
import Header from "../Templates/Header";
import "./Menu.css";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
	const navigate = useNavigate();

	const handleBookings = () => {
		// Redireciona para a página desejada sem validação
		navigate("/bookings");
	};
    const handleServices = () => {
		// Redireciona para a página desejada sem validação
		navigate("/services");
	};
    const handleCustomers = () => {
		// Redireciona para a página desejada sem validação
		navigate("/customers");
	};
    const handlePets = () => {
		// Redireciona para a página desejada sem validação
		navigate("/pets");
	};
    const handleWorkers = () => {
		// Redireciona para a página desejada sem validação
		navigate("/workers");
	};

	return (
		<div className="menu-content">
			<Header />
			<h1 className="title">MENU</h1>
			<div className="menu-container">
				<button className="menu-item" onClick={handleBookings}>
					<img src={require("../../assets/But_Bookings.png")} alt="Bookings" />
					<p>AGENDAMENTOS</p>
				</button>
                <button className="menu-item2" onClick={handleServices}>
					<img src={require("../../assets/But_Services.png")} alt="Services" />
					<p>SERVIÇOS</p>
				</button>
                <button className="menu-item" onClick={handleCustomers}>
					<img src={require("../../assets/But_Customers.png")} alt="Customers" />
					<p>CLIENTES</p>
				</button>
                <button className="menu-item2" onClick={handlePets}>
					<img src={require("../../assets/But_Pets.png")} alt="Pets" />
					<p>PETS</p>
				</button>
                <button className="menu-item" onClick={handleWorkers}>
					<img src={require("../../assets/But_Workers.png")} alt="Workers" />
					<p>FUNCIONÁRIOS</p>
				</button>
			</div>
		</div>
	);
};
