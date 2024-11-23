import React from "react";
import Header from "../Templates/Header";
import "./Pets.css";
import { useNavigate } from 'react-router-dom';

const Pets = () => {
	return (
		<div className="pets-content">
			<Header />
			<h1 className="title">PETS</h1>
		</div>
	);
};

export default Pets;