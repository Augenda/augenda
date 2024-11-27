import React, { useState, useEffect } from "react";
import Header from "./Header";
import Search from "../Templates/Search";

const SearchServices = () => {
	const [services, setServices] = useState([]);

	useEffect(() => {
		// Fazendo a requisição para buscar os dados
		fetch("http://localhost:5000/api/services")
			.then((response) => response.json())
			.then((data) => setServices(data))
			.catch((error) => console.error("Erro ao carregar serviços:", error));
	}, []);

	return (
	<div className="search-services">
		<Header />
		<Search
			title="SERVIÇOS"
			data={services}
			keyExtractor={(service) => service.id} // Usar o campo de ID como chave
			renderItem={(service) => (
				<div className="service-item">
					<div>
						<strong>{service.description}</strong>
						<p>{service.price}</p>
                        <p>{service.status}</p>
					</div>
				</div>
			)}
		/>
	</div>
	);
};

export default SearchServices;

//BACK END EXEMPLO DE RETORNO

// [
// 	{
// 		"id": 1,
// 		"descricao": "banho",
      //"price": "2.55"
        //"status": "active"
// 
// 
// 	}

