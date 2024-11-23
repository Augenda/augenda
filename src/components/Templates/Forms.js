import React from "react";
import "./Forms.css";
import { useNavigate } from 'react-router-dom';


const Forms = () => {
	const navigate = useNavigate();

	 const handleAddInfo = () => {
	 	navigate("/addworker");
	 };

	return (
		<div className="form-content">
			<div className="form-container">
				<button className="form-buttons" onClick={handleAddInfo}
                >
					<img src={require("../../assets/But_Add.png")} alt="Add_Info" />
					<p>ADICIONAR</p>
				</button>
                <button className="form-buttons" //onClick={handleSearchInfo}
                >
					<img src={require("../../assets/But_Search.png")} alt="Search_Info" />
					<p>PESQUISAR</p>
				</button>
                <button className="form-buttons" //onClick={handleDeleteInfo}
                >
					<img src={require("../../assets/But_Delete.png")} alt="Delete_Info" />
					<p>EXCLUIR</p>
				</button>
			</div>
		</div>
	);
};


export default Forms;