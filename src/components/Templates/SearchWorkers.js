import React, { useState, useEffect } from "react";
import Header from "./Header";
import Search from "../Templates/Search";

const SearchWorkers = () => {
	const [workers, setWorkers] = useState([]);

	useEffect(() => {
		// Fazendo a requisição para buscar os dados
		fetch("http://localhost:5000/api/users_photos")
			.then((response) => response.json())
			.then((data) => setWorkers(data))
			.catch((error) => console.error("Erro ao carregar funcionários:", error));
	}, []);

	return (
	<div className="search-workers">
		<Header />
		<Search
			title="FUNCIONÁRIOS"
			data={workers}
			keyExtractor={(worker) => worker.id} // Usar o campo de ID como chave
			renderItem={(worker) => (
				<div className="worker-item">
					<img
						src={worker.profile_image} // Certifique-se de que a URL da foto esteja no formato correto
						alt={`Foto de ${worker.name}`}
						style={{ width: "50px", height: "50px", borderRadius: "50%" }}
					/>
					<div>
						<strong>{worker.name}</strong>
						<p>{worker.username}</p>
					</div>
				</div>
			)}
		/>
	</div>
	);
};

export default SearchWorkers;

//BACK END EXEMPLO DE RETORNO

// [
// 	{
// 		"id": 1,
// 		"name": "João Silva",
// 		"username": "joao123",
// 		"photo": "http://localhost:5000/uploads/joao.jpg"
// 	},
// 	{
// 		"id": 2,
// 		"name": "Maria Santos",
// 		"username": "maria123",
// 		"photo": "http://localhost:5000/uploads/maria.jpg"
// 	}
// ]

