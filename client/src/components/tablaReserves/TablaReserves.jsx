/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./tablaReserves.css";

const TablaReserves = () => {
  const role = localStorage.getItem("role");
  const [reserves, setReserves] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role == 0) {
      getReservesUser();
    } else if (role == 1) {
      getReservesAdmin();
    }
  }, [role]);

  const getReservesUser = async () => {
    try {
      const response = await axios.get("/api/myReserves", {
        withCredentials: true,
      });
      if (response.data && response.data.success && response.data.reserves) {
        setReserves(response.data.reserves);
        setError("");
      } else {
        setError("No hay reservas disponibles");
        setReserves([]);
      }
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      setError("Error al cargar las reservas");
      setReserves([]);
    }
  };

  const getReservesAdmin = async () => {
    try {
      const response = await axios.get("/api/reserves", {
        withCredentials: true,
      });
      if (response.data && response.data.success && response.data.reserves) {
        setReserves(response.data.reserves);
        setError("");
      } else {
        setError("No hay reservas disponibles");
        setReserves([]);
      }
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      setError("Error al cargar las reservas");
      setReserves([]);
    }
  };

  const handleDeleteReserve = async (reserveId) => {
    try {
      const response = await axios.delete(`/api/deleteReserve/${reserveId}`, {
        withCredentials: true,
      });
      if (response.data && response.data.success) {
        if (role == 0) {
          getReservesUser();
        } else if (role == 1) {
          getReservesAdmin();
        }
      } else {
        setError("Error al eliminar la reserva");
      }
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      setError("Error al eliminar la reserva");
    }
  };

  return (
    <div className="container tablaReserves col auto mt-4 mb-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="reservesTitle text-center">
        <h1>RESERVAS</h1>
      </div>
      <div>
        <div className="container">
          <div className="headReserves table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">
                    <strong>Evento</strong>
                  </th>
                  <th scope="col">
                    <strong>Participante</strong>
                  </th>
                  <th scope="col">
                    <strong>Acciones</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reserves.map((reserve) => (
                  <tr key={reserve._id}>
                    <td>
                      {reserve.event ? (
                        reserve.event.name
                      ) : (
                        <span className="text-danger">
                          Evento no disponible
                        </span>
                      )}
                    </td>
                    <td>
                      {reserve.participating.name}{" "}
                      {reserve.participating.surname}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReserve(reserve._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaReserves;
