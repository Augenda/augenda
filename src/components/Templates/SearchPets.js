import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";
import "./SearchPets.css";

const SearchPets = () => {
  const [pets, setPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  useEffect(() => {
    // Fazendo a requisição para buscar os dados
    fetch("http://localhost:5000/api/pets_photos")
      .then((response) => response.json())
      .then((data) => {
        const sortedPets = data.sort((a, b) => a.id - b.id);
        setPets(sortedPets);
      })
      .catch((error) => console.error("Erro ao carregar pets:", error));
  }, []);

  // Função para abrir o modal e definir o pet atual
  const handleEdit = (pet) => {
    setCurrentPet(pet);
    setIsModalOpen(true);
  };

  // Fechar o modal e resetar o pet atual
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPet(null);
  };

  // Atualizar os campos do pet no modal
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentPet((prev) => ({ ...prev, [name]: value }));
  };

  // Salvar as alterações do pet
  const handleSave = () => {
    fetch(`http://localhost:5000/api/pets/${currentPet.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentPet),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erro ao salvar o pet: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((updatedPet) => {
        setPets((prev) =>
          prev.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
        );
        handleCloseModal();
      })
      .catch((error) => console.error("Erro ao salvar o pet:", error));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Captura o arquivo selecionado
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);

      // Enviar o arquivo ao servidor
      fetch(`http://localhost:5000/api/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(
                `Erro no upload da foto: ${response.status} - ${text}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          // Supondo que o servidor retorna a URL ou ID da nova foto
          const photoUrl = data.photoUrl;
          setCurrentPet((prev) => ({ ...prev, photo: photoUrl }));
        })
        .catch((error) =>
          console.error("Erro ao fazer upload da foto:", error)
        );
    }
  };



  const deletePet = async (petId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao excluir pet:", errorData.error);
        alert(errorData.error);
        return;
      }
  
      const result = await response.json();
      alert(result.message);
      // Atualize a lista de pets após a exclusão
      fetchPets();
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      alert("Erro ao excluir pet.");
    }
  };
  
  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets");
      if (!response.ok) {
        console.error("Erro ao buscar pets");
        return;
      }
      const data = await response.json();
      setPets(data); // Supondo que você tenha um state chamado `pets`
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    }
  };



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
                  src={pet.photo}
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
                <button className="edit-pet" onClick={() => handleEdit(pet)}>
                  Editar
                </button>
                <button className="delete-pet"
                onClick={() => deletePet(pet.id)}>Excluir</button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Pet</h2>
            <form>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={currentPet?.name || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Raça:
                <input
                  type="text"
                  name="breed"
                  value={currentPet?.breed || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Idade:
                <input
                  type="number"
                  name="age"
                  value={currentPet?.age || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Tipo:
                <input
                  type="text"
                  name="type"
                  value={currentPet?.type || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Foto:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange} // Captura o novo arquivo
                />
              </label>
              <div className="preview-image">
                {currentPet?.photo && (
                  <img
                    src={currentPet.photo}
                    alt="Pré-visualização"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
            </form>
            <div className="modal-actions">
              <button className="edit-button" onClick={handleSave}>Salvar</button>
              <button className="cancelEdit-button" onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPets;

