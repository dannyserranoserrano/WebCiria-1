/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./tablaReserves.css";

const TablaReserves = () => {
  const role = localStorage.getItem("role");
  const [reservas, setReservas] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (role == 0) {
      getReservesUser();
    } else if (role == 1) {
      getReservesAdmin();
    }
  }, [role]);

  // ****** RECUPERAR RESERVAS USUARIO (Role => 0) ******
  const getReservesUser = async () => {
    try {
      const response = await axios.get("/api/myReserves", {
        withCredentials: true,
      });

      const reservasData = response.data.reserves;
      console.log("Retorno de Servidor:", reservasData);

      if (reservasData && Array.isArray(reservasData) && reservasData.length > 0) {
        setReservas(reservasData);
        setErrorMessage("");
      } else {
        setErrorMessage("No estás inscrit@ en ningún evento");
        setReservas([]);
      }
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setErrorMessage("Error al cargar las reservas" + (error.response?.data?.message || error.message));
      setReservas([]);
    }
  };

  // ****** RECUPERAR TODAS LAS RESERVAS (Role => 1) ******
  const getReservesAdmin = async () => {
    try {
      const response = await axios.get("/api/reserves", {
        withCredentials: true,
      });

      const reservasData = response.data.reserves;
      console.log('Retorno de Servidor:', reservasData);

      if (reservasData && Array.isArray(reservasData) && reservasData.length > 0) {
        setReservas(reservasData);
        setErrorMessage("");
      } else {
        setErrorMessage("No estás inscrit@ en ningún evento");
        setReservas([]);
      }

    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setErrorMessage("Error al cargar las reservas: " + (error.response?.data?.message || error.message));
      setReservas([]);
    }
  };

  // Ejecutar el borrado de una reserva
  const handleDeleteReserve = async (reserveId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        const response = await axios.delete(`/api/deleteReserve/${reserveId}`, { withCredentials: true, })
        if (response.data.success) {
          // Actualizar la lista después de eliminar
          if (role == 0) {
            setSuccessMessage(response.data.message)
            await getReservesUser();
          } else if (role == 1) {
            setSuccessMessage(response.data.message)
            await getReservesAdmin();
          }
        } else {
          setErrorMessage(response.data.message || "Error al eliminar la reserva");
        }
      } catch (error) {
        console.error("Error al eliminar:", error.response || error);
        setErrorMessage("Error al eliminar la reserva: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div>
      <div className="container tablaReserves mt-4 mb-4">
        <div className="headReserves table table-responsive mb-0">
          <div className="head2Events m-2">
            <div><strong>Evento</strong></div>
            <div><strong>Fecha</strong></div>
            <div><strong>Participante</strong></div>
            <div><strong>Borrar</strong></div>
          </div>
          <div>
            {Array.isArray(reservas) && reservas
              .filter(reserva => { return reserva && new Date(reserva.date_activity) >= new Date() })
              .sort((a, b) => new Date(a.date_activity) - new Date(b.date_activity))
              .map(reserva => (
                <div key={reserva.reserve_id} className="bodyReserves">
                  <div className="divReserves">
                    <div className="divReserve">{reserva.event_name || 'Evento no disponible'}</div>
                    <div className="divDateAct">{reserva.date_activity ? new Date(reserva.date_activity).toLocaleString('es') : 'Fecha no disponible'}</div>
                    <div>{reserva.user_name || ''}{" "}{reserva.user_surname || ''}</div>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReserve(reserva.reserve_id)}>Eliminar</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      {/* *****AVISOS DE ERRORES***** */}
      <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
        <div>{successMessage}</div>
      </div>
      <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
        <div>{errorMessage}</div>
      </div>
    </div>
  );
};

export default TablaReserves;