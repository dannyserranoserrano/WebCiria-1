import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './event.css'
import Header from '../../../components/header/Header'
import axios from "axios";




const Event = () => {

    const role = localStorage.getItem("role");
    const { eventId } = useParams();
    const [user, setUser] = useState({}); //Guardado del usuario
    const [evento, setEvento] = useState({}); //Guardado del evento
    const [activity, setActivity] = useState({}); //Guardado de la actividad
    const [isReserve, setIsReserve] = useState(false) //Estado de la reserva del usuario
    const [reserves, setReserves] = useState({}); //Guardado de las reservas

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        getUser()
        getEvent()
    }, [eventId])

    // Añadimos un nuevo useEffect que se ejecutará cuando tengamos los datos del usuario
    useEffect(() => {
        if (user.user_id) {
            getReserve()
        }
    }, [user, eventId])

    // Funcion para coger la reserva
    const getReserve = async () => {
        try {
            const response = await axios.get(`/api/findReserve/${eventId}`, {
                withCredentials: true
            });

            const reservasEvento = response.data.reserves;
            setReserves(reservasEvento);

            // Verificamos si el usuario actual tiene una reserva
            if (Array.isArray(reservasEvento)) {
                const userHasReserve = reservasEvento.some(
                    reserve => reserve.user_id === user.user_id
                );
                setIsReserve(userHasReserve);
            }
        } catch (error) {
            console.error('Error fetching reserves:', error);
            setErrorMessage("Error al cargar las reservas.");
        }
    };

    // *****FUNCION PARA RECOGER EVENTO*****
    const getEvent = async () => {
        try {
            if (role) {
                // Recogemos el evento
                const eventResponse = await axios.get(`/api/findEvent/${eventId}`, {
                    withCredentials: true
                });
                const eventData = eventResponse.data.event;
                setEvento(eventData);

                // Call getActivity only after we have the event data with activity_id
                if (eventData && eventData.activity_id) {
                    // Pass the activity_id directly to getActivity
                    getActivity(eventData.activity_id);
                }
            } else {
                setErrorMessage("Por favor, inicia sesión para ver este evento.");
            }
        } catch (error) {
            console.error('Error al cargar el evento:', error);
            setErrorMessage("Error al cargar el evento");
        }
    };

    // Funcion para coger los datos de usuario
    const getUser = async () => {
        try {
            // Recogemos los datos del usuario
            const userResponse = await axios.get('/api/findUser', {
                withCredentials: true
            });
            setUser(userResponse.data.user);

        } catch (error) {
            console.error('Error fetching event:', error);
            setErrorMessage("Error al recoger los datos de usuario.");
        }
    }

    // Función para coger la actividad
    const getActivity = async (id) => {
        try {
            // Use the id parameter instead of activityId state
            const response = await axios.get(`/api/findActivity/${id}`, {
                withCredentials: true
            });
            setActivity(response.data.activity);
        } catch (error) {
            console.error('Error fetching activity:', error);
            setErrorMessage("Error al cargar la actividad.");
        }
    }

    // *****FUNCION PARA CREAR RESERVA*****
    const handleSubmit = async (e) => {
        e.preventDefault();
        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres registarte como participante???")
        if (option === true) {
            try {
                const response = await axios.post(`/api/newReserve/${eventId}`, {}, {
                    withCredentials: true
                });
                setSuccessMessage(response.data.message)

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
                const response = await axios.delete(`/api/deleteEvent/${eventId}`, {
                    withCredentials: true
                });
                setSuccessMessage(response.data.message)

                setTimeout(() => {
                    window.location.href = '/events'
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Error al eliminar el evento")
                // setTimeout(() => {
                //     window.location.href = '/event'
                // }, 2000)
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
                <div className="container table table-responsive tablaEvent w-100" style={{ display: user.user_id ? "block" : "none" }}>
                    <div className="headEvent">
                        <div className="reqEvent"><strong>Evento:</strong> {evento.name}</div>
                        <div className="reqEvent"><strong>Fecha del Evento:</strong> {new Date(evento.date_activity).toLocaleString('es')}</div>
                        <div className="reqEvent"><strong>Actividad:</strong> {activity ? `${activity.name} (${activity.pay})` : 'Cargando...'}</div>
                        <div className="reqEvent"><strong>Descripción:</strong> {evento.description}</div>
                        <div className="reqEvent"><strong>Precio:</strong> {evento.price}€</div>
                        <div className="reqEvent"><strong>Participantes:</strong></div>
                        {reserves && reserves.length > 0 ? (
                            reserves.map(e => (
                                <div key={e.reserve_id} className="m-0 container">
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
                            <button className="btn btn-success" type="submit" hidden={isReserve == true} >Inscribirme </button>
                        </form>
                        <p className="message" style={{ display: isReserve == true ? "block" : "none" }}>Ya estás inscrito</p>
                    </div>
                </div>
                <div className="container eventButtons mb-3">
                    <div className=" row justify-content-between">
                        <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/events">Volver</Link>
                        </div>
                        {(role === 1 || user.user_id === evento.user_create_id) && (
                            <div className="btn-group col-auto ">
                                <Link className="btn btn-warning" type="button" key={evento.event_id} to={`/events/updateEvent/${eventId}`}>Modificar</Link>
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