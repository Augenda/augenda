import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";

const SearchCustomers = () => {
	const [customers, setCustomers] = useState([]);

	useEffect(() => {
		// Fazendo a requisição para buscar os dados
		fetch("http://localhost:5000/api/clients")
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
					<div>
						<strong>{customer.name}</strong>
						<p>{customer.phone}</p>
						<p>{customer.status}</p>
						<p>{customer.address}</p>
					</div>
				</div>
			)}
		/>
	</div>
	);
};

export default SearchCustomers;


