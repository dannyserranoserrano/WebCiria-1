/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./tablaReserves.css";
import { Alert } from "reactstrap";

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

  // ****** RECUPERAR RESERVAS USUARIO ******
  const getReservesUser = async () => {

    try {
      const response = await axios.get("/api/myReserves", {
        withCredentials: true,
      });
      if (response.data && response.data.success && response.data.reserves) {
        setReserves(response.data.reserves);
        setError("");
        console.log("reservas " + reserves)
      } else {
        setError("No hay reservas solicitadas");
        setReserves([]);
      }
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      setError("Error al cargar las reservas");
      setReserves([]);
    }
  };

  // ****** RECUPERAR TODAS LAS RESERVAS ******
  const getReservesAdmin = async () => {
    try {
      const response = await axios.get("/api/reserves", {
        withCredentials: true,
      });
      if (response.data && response.data.success && response.data.reserves) {
        setReserves(response.data.reserves);
        setError("");
        console.log(reserves)
      } else {
        setError("No hay reservas solicitadas");
        console.log("No hay reservas");
        setReserves([]);
      }
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
      console.log("Error al cargar las reservas");
      setError("Error al cargar las reservas");
      setReserves([]);
    }
  };

  // ****** ELIMINAR RESERVA ******
  const handleDeleteReserve = async (reserveId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
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
    }
  };

  return (
    <div className="container tablaReserves col auto mt-4 mb-4">
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
                    <strong>Fecha</strong>
                  </th>
                  <th scope="col">
                    <strong>Participante</strong>
                  </th>
                  <th scope="col">
                    <strong></strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reserves
                  .filter(reserve => reserve && reserve.event.dateActivity && new Date(reserve.event.dateActivity) >= new Date())
                  .sort((a, b) => new Date(a.dateActivity) - new Date(b.dateActivity))
                  .map((reserve) => (
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
                        {reserve.event && reserve.event.dateActivity ?
                          new Date(reserve.event.dateActivity).toLocaleString('es')
                          : 'Fecha no disponible'
                        }
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
            </table>{error && <div className="message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaReserves;
