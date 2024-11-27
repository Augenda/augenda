import React from "react";
import Header from "../Templates/Header";
import Forms from "../Templates/Forms";
import "./Appointments.css";
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
	const navigate = useNavigate();

	const handleAddInfo = () => navigate("/addappointment");
	const handleSearchInfo = () => navigate("/searchappointments");
	const handleDeleteInfo = () => console.log("Excluir Agendamento");
	return (
		<div className="appointments-content">
			<Header />
			<h1 className="title">AGENDAMENTOS</h1>
			<Forms 
			handleAddInfo={handleAddInfo} 
			handleSearchInfo={handleSearchInfo} 
			handleDeleteInfo={handleDeleteInfo}/>
		</div>
	);
};

export default Appointments;