import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import Header from "./Header";
import "./SearchCustomers.css";

const SearchCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    // Fazendo a requisição para buscar os dados
    fetch("http://localhost:5000/api/clients_photos")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Erro ao carregar clientes:", error));
  }, []);

  // Função para abrir o modal com os dados do cliente
  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  // Atualiza os campos do cliente no modal
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Salva as alterações do cliente
  const handleSave = () => {
    fetch(`http://localhost:5000/api/clients/${currentCustomer.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erro ao salvar cliente: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((updatedCustomer) => {
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          )
        );
        handleCloseModal();
      })
      .catch((error) => console.error("Erro ao salvar cliente:", error));
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
          setCurrentCustomer((prev) => ({ ...prev, photo: photoUrl }));
        })
        .catch((error) =>
          console.error("Erro ao fazer upload da foto:", error)
        );
    }
  };

  const deleteClient = async (clientId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      alert(data.message);
      fetchClients(); // Atualiza a lista de clientes após a exclusão
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente.");
    }
  };

  // Função para buscar os serviços
const fetchClients = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/clients");
    const data = await response.json();
    setCustomers(data); // Supondo que você use um state para armazenar os serviços
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
  }
};

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
                <button
                  className="edit-customer"
                  onClick={() => handleEdit(customer)}
                >
                  Editar
                </button>
                <button className="delete-customer"
                onClick={() => deleteClient(customer.id)}>Excluir</button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Cliente</h2>
            <form>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={currentCustomer?.name || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Telefone:
                <input
                  type="text"
                  name="phone"
                  value={currentCustomer?.phone || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  value={currentCustomer?.status || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Endereço:
                <input
                  type="text"
                  name="address"
                  value={currentCustomer?.address || ""}
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
                {currentCustomer?.photo && (
                  <img
                    src={currentCustomer.photo}
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

export default SearchCustomers;
