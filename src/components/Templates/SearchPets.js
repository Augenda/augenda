import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";
import './SearchPets.css'

const SearchPets = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // Fazendo a requisição para buscar os dados
    fetch("http://localhost:5000/api/pets_photos") // Atualize o endpoint para incluir o nome do cliente, se necessário
      .then((response) => response.json())
      .then((data) => {
        // Ordena os pets por ID antes de salvar no estado
        const sortedPets = data.sort((a, b) => a.id - b.id);
        setPets(sortedPets);
      })
      .catch((error) => console.error("Erro ao carregar pets:", error));
  }, []);

  return (
    <div className="search-pets">
      <Header />
      <div className="search-column">
        <Search
          title="PESQUISAR POR PETS"
          data={pets}
          keyExtractor={(pet) => pet.id} // Usar o ID como chave única
          renderItem={(pet) => (
            <div className="pet-item" key={pet.id}>
              <div className="pet-card">
                <img
                  src={pet.photo} // Certifique-se de que a URL da foto está correta no backend
                  alt={`Foto de ${pet.name}`}
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
                <div className="pet-info">
                  <strong>{pet.name}</strong>
                  <p>Raça: {pet.breed}</p>
                  <p>Nome do Dono: {pet.ownerName || "Desconhecido"}</p>
                  <p>Idade: {pet.age}</p>
                  <p>Tipo: {pet.type}</p>
                </div>
              </div>
            </div>
          )}
        />
      </div>
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
