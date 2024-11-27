import React from "react";
import Header from "../Templates/Header";
import Forms from "../Templates/Forms";
import "./Workers.css";
import { useNavigate } from "react-router-dom";

const Workers = () => {
	const navigate = useNavigate();

	const handleAddInfo = () => navigate("/addworker");
	const handleSearchInfo = () => navigate("/searchworkers");
	const handleDeleteInfo = () => console.log("Excluir trabalhador");
	return (
		<div className="workers-content">
			<Header />
			<h1 className="title">FUNCIONÁRIOS</h1>
			<Forms 
			handleAddInfo={handleAddInfo} 
			handleSearchInfo={handleSearchInfo} 
			handleDeleteInfo={handleDeleteInfo}/>
		</div>
	);
};

export default Workers;