import React from "react";
import Header from "../Templates/Header";
import "./Customers.css";
import { useNavigate } from 'react-router-dom';

const Customers = () => {
	return (
		<div className="customers-content">
			<Header />
			<h1 className="title">CLIENTES</h1>
		</div>
	);
};

export default Customers;