import React from "react";
import Header from "../Templates/Header";
import Forms from "../Templates/Forms";
import "./Workers.css";

const Workers = () => {
	return (
		<div className="workers-content">
			<Header />
			<h1 className="title">FUNCIONÁRIOS</h1>
			<Forms />
		</div>
	);
};

export default Workers;