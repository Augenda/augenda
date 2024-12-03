import React from "react";
import "./Forms.css";

const Forms = ({ handleAddInfo, handleSearchInfo, handleDeleteInfo }) => {
	return (
		<div className="form-content">
			<div className="form-container">
				<button className="form-buttons" onClick={handleAddInfo}>
					<img src={require("../../assets/But_Add.png")} alt="Add_Info" />
					<p>ADICIONAR</p>
				</button>
				<button className="form-buttons" onClick={handleSearchInfo}>
					<img src={require("../../assets/But_Search.png")} alt="Search_Info" />
					<p>PESQUISAR</p>
				</button>

			</div>
		</div>
	);
};

export default Forms;
