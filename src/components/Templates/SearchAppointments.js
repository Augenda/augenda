import React, { useState, useEffect } from "react";
import Search from "../Templates/Search";
import "./SearchAppointments.css";
import Header from "./Header";

const SearchAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [openAppointments, setOpenAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);

  // Função para marcar o agendamento como concluído
  // const markAsCompleted = (id) => {
  //   fetch(`http://localhost:5000/api/appointments/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       dt_completed: new Date().toISOString(), // Marca a data atual como data de conclusão
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then(() => {
  //       // Atualiza o estado para refletir a mudança
  //       setAppointments((prevAppointments) =>
  //         prevAppointments.map((appointment) =>
  //           appointments.appointment_id === id
  //             ? { ...appointment, dt_complete: new Date().toISOString() }
  //             : appointment
  //         )
  //       );
  //     })
  //     .catch((error) => console.error("Erro ao atualizar agendamento:", error));
  // };

  const markAsCompleted = (appointment) => {
    fetch(
      `http://localhost:5000/api/appointments/${appointment.appointment_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dt_completed: new Date().toISOString(), // Marca a data atual como data de conclusão
        }),
      }
    )
      .then((response) => response.json())
      .then(() => {
        // Atualiza os estados localmente
        setOpenAppointments((prevOpenAppointments) =>
          prevOpenAppointments.filter(
            (a) => a.appointment_id !== appointment.appointment_id
          )
        );

        setCompletedAppointments((prevCompletedAppointments) => [
          ...prevCompletedAppointments,
          {
            ...appointment,
            dt_complete: new Date().toISOString(), // Adiciona a data de conclusão
          },
        ]);
      })
      .catch((error) => console.error("Erro ao atualizar agendamento:", error));
  };

  useEffect(() => {
    // Busca os agendamentos em aberto
    fetch("http://localhost:5000/api/appointments?status=open")
      .then((response) => response.json())
      .then((data) => {
        // Verifique se a resposta é um array
        setOpenAppointments(Array.isArray(data) ? data : []); // Se não for um array, defina como array vazio
      })
      .catch((error) => {
        console.error("Erro ao carregar agendamentos abertos:", error);
        setOpenAppointments([]); // Em caso de erro, também garante que seja um array
      });

    // Busca os agendamentos concluídos
    fetch("http://localhost:5000/api/appointments?status=completed")
      .then((response) => response.json())
      .then((data) => {
        // Verifique se a resposta é um array
        setCompletedAppointments(Array.isArray(data) ? data : []); // Se não for um array, defina como array vazio
      })
      .catch((error) => {
        console.error("Erro ao carregar agendamentos concluídos:", error);
        setCompletedAppointments([]); // Em caso de erro, também garante que seja um array
      });
  }, []);

  return (
    <div>
      <Header />

      <div className="search-appointments">
        <h2 className="title">PESQUISAR POR AGENDAMENTOS</h2>
        <div className="appointments-columns">
          {/* Agendamentos em aberto */}
          <div className="appointments-column">
            <h3 className="subtitle">Agendamentos em Aberto</h3>
            {openAppointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="appointment-item"
              >
                <div className="container-appointment">
                  <strong>Serviço: {appointment.service}</strong>
                  <p>Funcionário: {appointment.employee}</p>
                  <p>Pet: {appointment.pet}</p>
                  <p>Clente(Dono): {appointment.client}</p>
                  <p>Valor: {appointment.service_price}</p>
                  <p>Data de início: {appointment.dt_ini}</p>
                  <p>Data de previsão: {appointment.dt_prev}</p>
                  <button
                    className="button-complete"
                    onClick={() => markAsCompleted(appointment)}
                  >
                    Concluir Agendamento
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Agendamentos concluídos */}
          <div className="appointments-column">
            <h3 className="subtitle">Agendamentos Concluídos</h3>
            {completedAppointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="appointment-item"
              >
                <div className="container-appointment">
                  <strong>Serviço: {appointment.service}</strong>
                  <p>Funcionário: {appointment.employee}</p>
                  <p>Pet: {appointment.pet}</p>
                  <p>Clente(Dono): {appointment.client}</p>
                  <p>Valor: {appointment.service_price}</p>
                  <p>Data de início: {appointment.dt_ini}</p>
                  <p>Data de previsão: {appointment.dt_prev}</p>
                  <p>Data de conclusão:{appointment.dt_complete}</p>{" "}
                  {/* Data de conclusão */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAppointments;
