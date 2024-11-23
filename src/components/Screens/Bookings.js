import React from "react";
import Header from "../Templates/Header";
import "./Bookings.css";
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
	return (
		<div className="bookings-content">
			<Header />
			<h1 className="title">AGENDAMENTOS</h1>
		</div>
	);
};

export default Bookings;