import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"
import './reserve.css'
import Header from '../../../components/header/Header'
import axios from "axios";

const ReserveAdmin = () => {
    const { reserveId } = useParams()
    const [event, setEvent] = useState({})
    const [participating, setParticipating] = useState({})
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getReserve = async () => {
            try {
                const response = await axios.get(`/api/findReserve/${reserveId}`, {
                    withCredentials: true
                });
                console.log(response);
                setEvent(response.data.reserve.event);
                setParticipating(response.data.reserve.participating);
            } catch (error) {
                console.error('Error fetching reserve:', error);
                setErrorMessage("Error al cargar la reserva");
                setTimeout(() => {
                    navigate('/reserves');
                }, 2000);
            }
        }
        getReserve()
    }, [reserveId, navigate])

    const deleteReserve = async (e) => {
        e.preventDefault();

        let option = window.confirm("Seguro que quieres eliminar esta reserva???")
        if (option === true) {
            try {
                const response = await axios.delete(`/api/deleteReserve/${reserveId}`, {
                    withCredentials: true
                });
                setSuccessMessage(response.data.message);

                setTimeout(() => {
                    navigate('/reserves');
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
                <div className="reserveTitle text-center mt-3"><p>ADMINISTRACIÓN DE RESERVAS</p></div>
                <div className="container tablaReserve">
                    <div className="headReserve">
                        <div><strong>Evento</strong></div>
                        <div><strong>Participante</strong></div>
                    </div>
                    <div className="bodyReserve">
                        <div>{event.name || <span className="text-danger">Evento no disponible</span>}</div>
                        <div>{participating.name} {participating.surname}</div>
                    </div>
                </div>

                {/* *****AVISOS DE ERRORES***** */}
                <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
                    <div>
                        {successMessage}
                    </div>
                </div>
                <div className="message_nok shadow-lg p-1 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
                    <div>
                        {errorMessage}
                    </div>
                </div>

                {/* *****Buttons***** */}
                <div className="container reserveButtons mb-3">
                    <div className="btn-group btn-group-sm col-auto ">
                        <button className="btn btn-danger" onClick={deleteReserve}>Borrar</button>
                    </div>
                    <div className="volverReserve">
                        <Link className="btn btn-sm btn-primary" type="button" to="/reserves">Volver</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReserveAdmin;