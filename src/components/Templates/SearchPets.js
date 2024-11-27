import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";

const SearchPets = () => {
	const [pets, setPets] = useState([]);

	useEffect(() => {
		// Fazendo a requisição para buscar os dados
		fetch("http://localhost:5000/api/pets")
			.then((response) => response.json())
			.then((data) => setPets(data))
			.catch((error) => console.error("Erro ao carregar pets:", error));
	}, []);

	return (
	<div className="search-pets">
		<Header />
		<Search
			title="PETS"
			data={pets}
			keyExtractor={(pet) => pet.id} // Usar o campo de ID como chave
			renderItem={(pet) => (
				<div className="pet-item">
					<img
						src={pet.photo} // Certifique-se de que a URL da foto esteja no formato correto
						alt={`Foto de ${pet.name}`}
						style={{ width: "50px", height: "50px", borderRadius: "50%" }}
					/>
					<div>
						<strong>{pet.name}</strong>
						<p>{pet.breed}</p>
						<p>{pet.age}</p>
						<p>{pet.idclient}</p>
						<p>{pet.type}</p>
					</div>
				</div>
			)}
		/>
	</div>
	);
};

export default SearchPets;

//BACK END EXEMPLO DE RETORNO

// [
// 	{
// 		"id": 1,
// 		"name": "Miko",
// 		"breed": "malhado",
//		"id.client": "1" (se conseguir exibir o nome do cliente)
// 		"photo": "http://localhost:5000/uploads/joao.jpg"
// 	},



