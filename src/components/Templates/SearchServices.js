import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";
import Search from "../Templates/Search";
import "./SearchServices.css";

const SearchServices = () => {
  // const [services, setServices] = useState([]);
  // useEffect(() => {
  //   // Fazendo a requisição para buscar os dados
  //   fetch("http://localhost:5000/api/services")
  //     .then((response) => response.json())
  //     .then((data) => setServices(data))
  //     .catch((error) => console.error("Erro ao carregar serviços:", error));
  // }, []);

  // return (
  //   <div className="search-services">
  //     <Header />
  //     <div className="list-services">
  //       <div className="column-services">
  //         <Search
  //           title="PESQUISAR POR SERVIÇOS"
  //           data={services}
  //           keyExtractor={(service) => service.id} // Usar o campo de ID como chave
  //           renderItem={(service) => (
  //             <div className="service-item">
  //               <div>
  //                 <strong>{service.description}</strong>
  //                 <p>{service.price}</p>
  //                 <p>{service.status}</p>
  //               </div>
  //               <button classname="edit-service">
  //                 Editar
  //               </button>
  //             </div>
  //           )}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/services")
        .then((response) => response.json())
        .then((data) => setServices(data))
        .catch((error) => console.error("Erro ao carregar serviços:", error));
    }, []);
  
    const handleEdit = (service) => {
      if (!service.service_id) {
        console.error("O serviço selecionado não possui um ID:", service);
        return;
      }
      setCurrentService(service); // Define o serviço atual para edição
      setIsModalOpen(true); // Abre o modal
    }
  
    const handleCloseModal = () => {
      setIsModalOpen(false); // Fecha o modal
      setCurrentService(null); // Reseta o serviço atual
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setCurrentService((prev) => ({ ...prev, [name]: value })); // Atualiza os valores do serviço
    };
  
    const handleSave = () => {
      // Envia as mudanças para o servidor
      fetch(`http://localhost:5000/api/services/${currentService.service_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentService),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(`Erro na resposta do servidor: ${response.status} - ${text}`);
            });
          }
          return response.json();
        })
        .then((updatedService) => {
          setServices((prev) =>
            prev.map((service) =>
              service.service_id === updatedService.service_id ? updatedService : service
            )
          );
          handleCloseModal();
        })
        .catch((error) => console.error("Erro ao salvar serviço:", error));
    };

    // Função para buscar os serviços
const fetchServices = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/services");
    const data = await response.json();
    setServices(data); // Supondo que você use um state para armazenar os serviços
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
  }
};


    const deleteService = async (serviceId) => {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir este serviço?");
      if (!confirmDelete) return;
    
      try {
        const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
          method: "DELETE",
        });
    
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
    
        const data = await response.json();
        alert(data.message);
        fetchServices(); // Atualiza a lista de serviços após a exclusão
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        alert("Erro ao excluir serviço.");
      }
    };
    
  
    return (
      <div className="search-services">
        <Header />
        <div className="list-services">
          <div className="column-services">
            <Search
              title="PESQUISAR POR SERVIÇOS"
              data={services}
              keyExtractor={(service) => service.service_id}
              renderItem={(service) => (
                <div className="service-item">
                  <div>
                    <strong>{service.description}</strong>
                    <p>R$ {service.price}</p>
                    <p>{service.status}</p>
                  </div>
                  <button
                    className="edit-service"
                    onClick={() => handleEdit(service)}
                  >
                    Editar
                  </button>
                  <button className="delete-service"
                   onClick={() => deleteService(service.service_id)}>Excluir</button>
                </div>
              )}
            />
          </div>
        </div>
  
        {/* Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2 className="title">Editar Serviço</h2>
              <form>
                <label>
                  Descrição:
                  <input
                    type="text"
                    name="description"
                    value={currentService?.description || ""}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Preço:
                  <input
                    type="text"
                    name="price"
                    value={currentService?.price || ""}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Status:
                  <input
                    type="text"
                    name="status"
                    value={currentService?.status || ""}
                    onChange={handleInputChange}
                  />
                </label>
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
export default SearchServices;

