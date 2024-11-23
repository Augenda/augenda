import React from "react";
import Header from "../Templates/Header";
import Forms from "../Templates/Forms";
import "./Pets.css";
import { useNavigate } from 'react-router-dom';

const Pets = () => {
	const navigate = useNavigate();

	const handleAddInfo = () => navigate("/addpet");
	const handleSearchInfo = () => console.log("Pesquisar pet");
	const handleDeleteInfo = () => console.log("Excluir pet");
	return (
		<div className="pets-content">
			<Header />
			<h1 className="title">PETS</h1>
			<Forms handleAddInfo={handleAddInfo} 
				handleSearchInfo={handleSearchInfo} 
				handleDeleteInfo={handleDeleteInfo}/>
		</div>
	);
};

export default Pets;