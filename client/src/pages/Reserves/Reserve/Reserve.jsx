import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./reserve.css";
import Header from "../../../components/header/Header";
import axios from "axios";

const Reserve = () => {
  const { reserveId } = useParams();
  const [reserve, setReserve] = useState({});
  const [event, setEvent] = useState({});
  const [participating, setParticipating] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getReserve = async () => {
      try {
        const userResponse = await axios.get("/api/findUser", {
          withCredentials: true,
        });
        setUserId(userResponse.data.user._id);

        // if (!reserveId) {
        //     setErrorMessage("No se puede acceder a la reserva.");
        //     setTimeout(() => {
        //         navigate('/reserves');
        //     }, 2000);
        //     return;
        // }

        const response = await axios.get(`/api/findReserve/${reserveId}`, {
          withCredentials: true,
        });
        console.log(reserve);
        if (response.data.reserve) {
          setReserve(response.data.reserve);
          if (response.data.reserve.event) {
            setEvent(response.data.reserve.event);
          }
          setParticipating(response.data.reserve.participating);

          // Verify if the user owns this reservation
          if (
            response.data.reserve.participating._id !==
            userResponse.data.user._id
          ) {
            setErrorMessage("No tienes permiso para ver esta reserva.");
            setTimeout(() => {
              navigate("/reserves");
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching reserve:", error);
        if (error.response?.status === 401) {
          setErrorMessage("Por favor, inicia sesión para ver esta reserva.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setErrorMessage(
            "Error al cargar la reserva. Por favor, inténtalo de nuevo."
          );
          setTimeout(() => {
            navigate("/reserves");
          }, 2000);
        }
      }
    };
    getReserve();
  }, [reserve, reserveId, navigate]);

  const deleteReserve = async (e) => {
    e.preventDefault();

    let option = window.confirm("¿Seguro que quieres eliminar esta reserva?");
    if (option === true) {
      try {
        const response = await axios.delete(`/api/deleteReserve/${reserveId}`, {
          withCredentials: true,
        });
        setSuccessMessage(response.data.message);

        setTimeout(() => {
          navigate("/reserves");
        }, 2000);
      } catch (error) {
        setErrorMessage("Error al eliminar la reserva");
        setTimeout(() => {
          navigate(`/reserves/${reserveId}`);
        }, 2000);
      }
    }
  };

  return (
    <div className=" reserve">
      <div className="header">
        <Header />
      </div>
      <div className="container centerReserve">
        <div className="reserveTitle text-center mt-3">
          <p>GESTION DE RESERVA</p>
        </div>
        <div className="container tablaReserve table table-responsive">
          <div className="headReserve">
            <div>
              <strong>Evento</strong>{" "}
              {event ? (
                event.name
              ) : (
                <span className="text-danger">El evento ya no existe</span>
              )}
            </div>
            <div>
              <strong>Participante</strong> {participating.name}{" "}
              {participating.surname}
            </div>
          </div>
        </div>

        {/* *****AVISOS DE ERRORES***** */}
        <div
          className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center"
          style={{ display: successMessage ? "block" : "none" }}
        >
          <div>{successMessage}</div>
        </div>
        <div
          className="message_nok shadow-lg p-3 m-3 bg-body rounded border text-center"
          style={{ display: errorMessage ? "block" : "none" }}
        >
          <div>{errorMessage}</div>
        </div>

        {/* *****Buttons***** */}
        <div className="container reserveButtons mb-3">
          {participating._id === userId && (
            <div className="btn-group btn-group-sm col-auto ">
              <button className="btn btn-danger" onClick={deleteReserve}>
                Borrar
              </button>
            </div>
          )}
          <div className="volverReserve">
            <Link
              className="btn btn-sm btn-primary"
              type="button"
              to="/reserves"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reserve;
