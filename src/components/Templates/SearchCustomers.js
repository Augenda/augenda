import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";
import "./SearchCustomers.css";

const SearchCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fazendo a requisição para buscar os dados
    fetch("http://localhost:5000/api/clients_photos")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Erro ao carregar clientes:", error));
  }, []);

  return (
    <div className="search-customers">
      <Header />
      <div className="search-column">
        <Search
          title="PESQUISAR POR CLIENTES"
          data={customers}
          keyExtractor={(customer) => customer.id}
          renderItem={(customer) => (
            <div className="customer-item" key={customer.id}>
              <div className="customer-card">
                <img
                  src={customer.photo}
                  alt={`Foto de ${customer.name}`}
                  className="customer-photo"
                />
                <div className="customer-info">
                  <strong>{customer.name}</strong>
                  <p>
                    <strong>Telefone:</strong> {customer.phone}
                  </p>
                  <p>
                    <strong>Status:</strong> {customer.status}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {customer.address}
                  </p>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SearchCustomers;
