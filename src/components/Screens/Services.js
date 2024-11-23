import React from "react";
import Header from "../Templates/Header";
import "./Services.css";
import { useNavigate } from 'react-router-dom';

const Services = () => {
	return (
		<div className="services-content">
			<Header />
			<h1 className="title">SERVIÇOS</h1>
		</div>
	);
};

export default Services;