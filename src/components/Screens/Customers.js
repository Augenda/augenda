import React from "react";
import Header from "../Templates/Header";
import Forms from "../Templates/Forms";
import "./Customers.css";
import { useNavigate } from 'react-router-dom';

const Customers = () => {
	const navigate = useNavigate();

	const handleAddInfo = () => navigate("/addcustomer");
	const handleSearchInfo = () => console.log("Pesquisar Cliente");
	const handleDeleteInfo = () => console.log("Excluir Cliente");
	return (
		<div className="workers-content">
			<Header />
			<h1 className="title">CLIENTES</h1>
			<Forms 
			handleAddInfo={handleAddInfo} 
			handleSearchInfo={handleSearchInfo} 
			handleDeleteInfo={handleDeleteInfo}/>
		</div>
	);
};

export default Customers;