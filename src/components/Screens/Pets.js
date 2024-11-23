import React from "react";
import Header from "../Templates/Header";
import Forms from "../Templates/Forms";
import "./Pets.css";
import { useNavigate } from 'react-router-dom';

const Pets = () => {
	return (
		<div className="pets-content">
			<Header />
			<h1 className="title">PETS</h1>
			<Forms />
		</div>
	);
};

export default Pets;