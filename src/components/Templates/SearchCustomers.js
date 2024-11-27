import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";

const SearchCustomers = () => {
	const [customers, setCustomers] = useState([]);

	useEffect(() => {
		// Fazendo a requisição para buscar os dados
		fetch("http://localhost:5000/api/customers")
			.then((response) => response.json())
			.then((data) => setCustomers(data))
			.catch((error) => console.error("Erro ao carregar clientes:", error));
	}, []);

	return (
	<div className="search-customers">
		<Header />
		<Search
			title="CLIENTES"
			data={customers}
			keyExtractor={(customer) => customer.id} // Usar o campo de ID como chave
			renderItem={(customer) => (
				<div className="customer-item">
					<img
						src={customer.photo} // Certifique-se de que a URL da foto esteja no formato correto
						alt={`Foto de ${customer.name}`}
						style={{ width: "50px", height: "50px", borderRadius: "50%" }}
					/>
					<div>
						<strong>{customer.name}</strong>
						<p>{customer.phone}</p>
						<p>{customer.status}</p>
						<p>{customer.adress}</p>
					</div>
				</div>
			)}
		/>
	</div>
	);
};

export default SearchCustomers;


