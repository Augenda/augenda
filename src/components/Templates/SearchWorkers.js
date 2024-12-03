import React, { useState, useEffect } from "react";
import Header from "./Header";
import Search from "../Templates/Search";
import "./SearchWorkers.css";

const SearchWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users_photos")
      .then((response) => response.json())
      .then((data) => setWorkers(data))
      .catch((error) => console.error("Erro ao carregar funcionários:", error));
  }, []);

  const handleEdit = (worker) => {
    if (!worker.id) {
      console.error("O funcionário selecionado não possui um ID:", worker);
      return;
    }
    setCurrentWorker(worker); // Define o funcionário atual para edição
    setIsModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setCurrentWorker(null); // Reseta o funcionário atual
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentWorker((prev) => ({ ...prev, [name]: value })); // Atualiza os valores do funcionário
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/api/users_photos/${currentWorker.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentWorker),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `Erro na resposta do servidor: ${response.status} - ${text}`
            );
          });
        }
        return response.json();
      })
      .then((updatedWorker) => {
        setWorkers((prev) =>
          prev.map((worker) =>
            worker.id === updatedWorker.id ? updatedWorker : worker
          )
        );
        handleCloseModal();
      })
      .catch((error) => console.error("Erro ao salvar funcionário:", error));
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
          setCurrentWorker((prev) => ({ ...prev, photo: photoUrl }));
        })
        .catch((error) =>
          console.error("Erro ao fazer upload da foto:", error)
        );
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este funcionário?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      alert(data.message);
      fetchUsers(); // Atualiza a lista de funcionários após a exclusão
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      alert("Erro ao excluir funcionário.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários.");
      }
      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      alert("Não foi possível carregar os usuários.");
    }
  };
  

  return (
    <div className="search-workers">
      <Header />
      <div className="search-column">
        <Search
          title="PESQUISAR POR FUNCIONÁRIOS"
          data={workers}
          keyExtractor={(worker) => worker.id}
          renderItem={(worker) => (
            <div className="worker-card">
              <img
                src={worker.photo}
                alt={`Foto de ${worker.name}`}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <div className="worker-info">
                <strong>Nome: {worker.name}</strong>
                <p>Usuário: {worker.username}</p>
                <p>Status: {worker.status}</p>
              </div>
              <button
                className="edit-worker"
                onClick={() => handleEdit(worker)}
              >
                Editar
              </button>
			  <button className="delete-worker"
        onClick={() => deleteUser(worker.id)}
        >
				Excluir
			  </button>
            </div>
          )}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="title">Editar Funcionário</h2>
            <form>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={currentWorker?.name || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Usuário:
                <input
                  type="text"
                  name="username"
                  value={currentWorker?.username || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  value={currentWorker?.status || ""}
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
                {currentWorker?.photo && (
                  <img
                    src={currentWorker.photo}
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
              <button className="edit-button" onClick={handleSave}>
                Salvar
              </button>
              <button className="cancelEdit-button" onClick={handleCloseModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
