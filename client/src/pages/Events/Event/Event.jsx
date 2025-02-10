import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './event.css'
import Header from '../../../components/header/Header'
import axios from "axios";


const Event = () => {
    const role = localStorage.getItem("role");
    const { eventId } = useParams();
    const [event, setEvent] = useState([]);
    const [participating, setParticipating] = useState([]);
    const [activity, setActivity] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userParticipating, setUserParticipating] = useState(false)

    useEffect(() => {
        getEvent()
    }, [eventId])

    // *****FUNCION PARA RECOGER EVENTO*****
    const getEvent = async () => {
        try {
            if (role) {
                const userResponse = await axios.get('/api/findUser', {
                    withCredentials: true
                });
                setUserRole(userResponse.data.user.role);
                setCurrentUserId(userResponse.data.user._id);

                const response = await axios.get(`/api/findEvent/${eventId}`, {
                    withCredentials: true
                });
                console.log(response);
                setEvent(response.data.event);
                setParticipating(response.data.event.participating);

                // Verificar si el usuario actual está en la lista de participantes
                const isParticipating = response.data.event.participating.some(
                    participant => participant._id === userResponse.data.user._id
                );
                setUserParticipating(isParticipating);
                console.log(isParticipating)
                setActivity(response.data.event.activity);
            } else {
                setErrorMessage("Por favor, inicia sesión para ver este evento.");
            }
        } catch (error) {
            console.error('Error fetching event:', error);
            setErrorMessage("Error al cargar el evento.");
        }
    };

    // *****FUNCION PARA CREAR RESERVA*****
    const handleSubmit = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres registarte como participante???")
        if (option === true) {
            try {
                const response2 = await axios.post(`/api/newReserve/${eventId}`, {}, {
                    withCredentials: true
                });
                setSuccessMessage(response2.data.message)

                setTimeout(() => {
                    window.location.href = `/events/${eventId}`
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Error al realizar la reserva")
                setTimeout(() => {
                    window.location.href = '/events'
                }, 2000)
            }
        };
    };

    // *****FUNCION PARA BORRAR RESERVA*****
    const deleteEvent = async (e) => {
        e.preventDefault();

        let option = window.confirm("Seguro que quieres borrar este Evento???")
        if (option === true) {
            try {
                const response2 = await axios.delete(`/api/deleteEvent/${eventId}`, {
                    withCredentials: true
                });
                setSuccessMessage(response2.data.message)

                setTimeout(() => {
                    window.location.href = '/events'
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Error al eliminar el evento")
                setTimeout(() => {
                    window.location.href = '/event'
                }, 2000)
            }
        };
    };

    return (
        <div className="event">
            <div className="header">
                <Header />
            </div>
            <div className="container centerEvent">
                <div className="eventTitle text-center"><p>EVENTO</p></div>
                <div className="container table table-responsive tablaEvent w-100" style={{ display: userParticipating ? "block" : "none" }}>
                    <div className="headEvent">
                        <div className="reqEvent"><strong>Evento:</strong> {event.name}</div>
                        <div className="reqEvent"><strong>Fecha del Evento:</strong> {new Date(event.dateActivity).toLocaleString('es')}</div>
                        <div className="reqEvent"><strong>Actividad:</strong> {activity.name} ({activity.pay})</div>
                        <div className="reqEvent"><strong>Descripción:</strong> {event.description}</div>
                        <div className="reqEvent"><strong>Precio:</strong> {event.price}€</div>
                        <div className="reqEvent"><strong>Participantes:</strong></div>
                        {participating && participating.length > 0 ? (
                            participating.map(e => (
                                <div key={e._id} className="m-0 container">
                                    <div className="resEvent p-0">- {e.name} {e.surname}</div>
                                </div>
                            ))
                        ) : (
                            <div className="m-0 container">
                                <div className="resEvent p-0">No hay participantes registrados</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* *****AVISOS DE ERRORES***** */}
                <div className="container messagesBox">
                    <div className="message" style={{ display: successMessage ? "block" : "none" }}>
                        <div> {successMessage} </div>
                    </div>
                    <div className="message" style={{ display: errorMessage ? "block" : "none" }}>
                        <div> {errorMessage} </div>
                    </div>
                </div>


                {/* *****Buttons***** */}
                <div className="row justify-content-center m-4">
                    <div className="col-auto">
                        <form onSubmit={handleSubmit}>
                            <button className="btn btn-success" type="submit" hidden={userParticipating || !role} >Inscribirme </button>
                        </form>
                        <p className="message" style={{ display: userParticipating ? "block" : "none" }}>Ya estás inscrito</p>
                    </div>
                </div>
                <div className="container eventButtons mb-3">
                    <div className=" row justify-content-between">
                        <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/events">Volver</Link>
                        </div>
                        {(userRole === 1 || currentUserId === event.userCreate) && (
                            <div className="btn-group col-auto ">
                                <Link className="btn btn-warning" type="button" key={event._id} to={`/events/updateEvent/${eventId}`}>Modificar</Link>
                                <button className="btn btn-danger" onClick={deleteEvent}>Borrar </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Event;