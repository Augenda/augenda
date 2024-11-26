import React from "react";
import Header from "../Templates/Header";
import "./Services.css";
import { useNavigate } from 'react-router-dom';
import Forms from "../Templates/Forms";

const Services = () => {
	const navigate = useNavigate();

	const handleAddInfo = () => navigate("/addservice");
	const handleSearchInfo = () => console.log("Pesquisar serviço");
	const handleDeleteInfo = () => console.log("Excluir serviço");
	return (
		<div className="services-content">
			<Header />
			<h1 className="title">SERVIÇOS</h1>
			<Forms handleAddInfo={handleAddInfo} 
				handleSearchInfo={handleSearchInfo} 
				handleDeleteInfo={handleDeleteInfo}/>
		</div>
	);
};

export default Services;