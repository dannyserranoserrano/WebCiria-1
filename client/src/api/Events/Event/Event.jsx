import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './event.css'
import Header from '../../../components/header/Header'
import axios from "axios";


const Event = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState([]);
    const [participating, setParticipating] = useState([]);
    const [activity, setActivity] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const getEvent = async () => {
            try {
                const userResponse = await axios.get('/api/findUser', {
                    withCredentials: true
                });
                setUserRole(userResponse.data.user.role);
                setCurrentUserId(userResponse.data.user._id);

                const response = await axios.get(`/api/findEvent/${eventId}`, {
                    withCredentials: true
                });
                console.log(response);
                setEvent(response.data.event)
                setParticipating(response.data.event.participating)
                setActivity(response.data.event.activity)
            } catch (error) {
                console.error('Error fetching event:', error);
                if (error.response?.status === 401) {
                    setErrorMessage("Por favor, inicia sesión para ver este evento.");
                } else {
                    setErrorMessage("Error al cargar el evento.");
                }
            }
        }
        getEvent()
    }, [eventId])

    // *****FUNCION PARA RESERVA*****
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

    // *****FUNCION PARA BORRAR*****
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
    // ******EVENT UNLOGGED*****
    const Evento = () => (
        <div className="event">
            <div className="header">
                <Header />
            </div>
            <div className="container centerEvent">
                <div className="eventTitle text-center"><p>EVENTO</p></div>
                <div className="container table table-responsive tablaEvent w-100">
                    <div className="headEvent ">
                        <div className="reqEvent"><strong>Evento:</strong></div>
                        <div className="resEvent"> {event.name}</div>
                        <div className="reqEvent"><strong>Actividad:</strong></div>
                        <div className="resEvent"> {activity.name} ({activity.pay})</div>
                        <div className="reqEvent"><strong>Descripción:</strong></div>
                        <div className="resEvent"> {event.description}</div>
                        <div className="reqEvent"><strong>Fecha de Actividad:</strong></div>
                        <div className="resEvent"> {new Date(event.dateActivity).toLocaleString('es')}</div>
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
                <div className="container eventButtons mb-3">
                    <div className=" row justify-content-start">
                        <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/events">Volver</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    // ******EVENTS LOGGED*****
    const EventoUser = () => (
        <div className="event">
            <div className="header">
                <Header />
            </div>
            <div className="container centerEvent">
                <div className="eventTitle text-center"><p>EVENTO</p></div>
                <div className="container table table-responsive tablaEvent w-100">
                    <div className="headEvent">
                        <div className="reqEvent"><strong>Evento:</strong> {event.name}</div>
                        <div className="reqEvent"><strong>Actividad:</strong> {activity.name} {activity.pay}</div>
                        <div className="reqEvent"><strong>Descripción:</strong> {event.description}</div>
                        <div className="reqEvent"><strong>Precio:</strong> {event.price}€</div>
                        <div className="reqEvent"><strong>Fecha de Actividad:</strong> {new Date(event.dateActivity).toLocaleString('es')}</div>
                        <div className="reqEvent"><strong>Participantes:</strong>  </div>
                        {participating.map(e => (
                            <div key={e._id} className="m-0 container">
                                <div className="resEvent p-0">-{e.name} {e.surname}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* *****AVISOS DE ERRORES***** */}
                <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
                    <div>
                        {successMessage}
                    </div>
                </div>
                <div className="message_nok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
                    <div>
                        {errorMessage}
                    </div>
                </div>

                {/* *****Buttons***** */}
                <div className="row justify-content-center m-4">
                    <div className="col-auto">
                        <form onSubmit={handleSubmit}>
                            <button className="btn btn-success" type="submit" >Inscribirme </button>
                        </form>
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    // ******EVENTS ADMIN*****
    const EventoAdmin = () => (
        <div className="event">
            <div className="header">
                <Header />
            </div>
            <div className="container centerEvent">
                <div className="eventTitle text-center"><p>EVENTO</p></div>
                <div className="container table table-responsive tablaEvent w-100">
                    <div className="headEvent">
                        <div className="reqEvent"><strong>Evento:</strong> {event.name}</div>
                        <div className="reqEvent"><strong>Actividad:</strong> {activity.name} ({activity.pay})</div>
                        <div className="reqEvent"><strong>Descripción:</strong> {event.description}</div>
                        <div className="reqEvent"><strong>Precio:</strong> {event.price}€</div>
                        <div className="reqEvent"><strong>Fecha de Actividad:</strong> {new Date(event.dateActivity).toLocaleString('es')}</div>
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
                <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
                    <div>
                        {successMessage}
                    </div>
                </div>
                <div className="message_nok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
                    <div>
                        {errorMessage}
                    </div>
                </div>

                {/* *****Buttons***** */}
                <div className="row justify-content-center m-4">
                    <div className="col-auto">
                        <form onSubmit={handleSubmit}>
                            <button className="btn btn-success" type="submit" >Inscribirme </button>
                        </form>
                    </div>
                </div>
                <div className="container eventButtons mb-3">
                    <div className=" row justify-content-between">
                        <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/events">Volver</Link>
                        </div>
                        <div className="btn-group col-auto ">
                            <Link className="btn btn-warning" type="button" key={event._id} to={`/events/updateEvent/${eventId}`}>Modificar</Link>
                            <button className="btn btn-danger" onClick={deleteEvent}>Borrar </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // *****Operacion ternaria multiple*****
    let evento = userRole === 0 ? EventoUser() : userRole === 1 ? EventoAdmin() : Evento()
    return (
        <div>
            {evento}
        </div>
    )
}

export default Event;