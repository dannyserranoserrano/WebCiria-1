import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import "./updateEvent.css"


const UpdateEvent = () => {
    const [userRole, setUserRole] = useState(null);

    const [updateEvent, setUpdateEvent] = useState({
        activity_id: "",
        name: "",
        description: "",
        price: "",
        date_activity: "",
    });

    const { eventId } = useParams();
    const [user, setUser] = useState({})
    const [event, setEvent] = useState({});
    const [activity, setActivity] = useState([])
    const [activities, setActivities] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        getEvent()
        getUser();
        getActivities();
    }, [])

    // ******BUSQUEDA DE EVENTO*****
    const getEvent = async () => {
        try {
            const response = await axios.get(`/api/findEvent/${eventId}`, {
                withCredentials: true
            });
            const eventData = response.data.event;
            setEvent(eventData);

            if (eventData && eventData.activity_id) {
                const activityResponse = await axios.get(`/api/findActivity/${eventData.activity_id}`, {
                    withCredentials: true
                });
                const activityData = activityResponse.data.activity;
                setActivity(activityData);
                setUpdateEvent({
                    ...updateEvent,
                    activity_id: activityData.activity_id,
                    name: eventData.name,
                    description: eventData.description,
                    price: eventData.price,
                    date_activity: eventData.date_activity,
                });

            }
        } catch (error) {
            console.error('Error fetching event:', error);
            setErrorMessage("Error al cargar el evento");
            setTimeout(() => {
                navigate('/events');
            }, 2000);
        }
    }

    // ******BUSQUEDA DE USUARIO*****
    const getUser = async () => {
        try {
            const response = await axios.get('/api/findUser', {
                withCredentials: true
            });
            console.log(response);
            setUser(response.data.user)
            setUserRole(response.data.user.role);
        } catch (error) {
            console.error('Error fetching user:', error);
            setErrorMessage("Error al cargar el usuario");
        }
    }

    // ******BUSQUEDA DE ACTIVIDADES*****    
    
    // Modificar la función getActivities
    const getActivities = async () => {
        try {
            const response = await axios.get("/api/activities", {
                withCredentials: true
            });
            // Asegurarse de que estamos guardando un array
            const activitiesData = response.data.activities || [];
            setActivities(activitiesData);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setErrorMessage("Error al cargar las actividades");
            setActivities([]); // En caso de error, mantener un array vacío
        }
    }

    // **********ACTUALIZAR EVENTO**********
    if ((event.user_create_id == user.user_id) || (userRole == 1)) {

        const handleChange = (e) => {
            if (e.target.name === 'activityId') {
                const selectedActivity = activities.find(a => a.activity_id === e.target.value);
                if (selectedActivity && selectedActivity.pay === 'Gratis') {
                    setUpdateEvent({
                        ...updateEvent,
                        activity_id: e.target.value,
                        price: '0'
                    });
                } else {
                    setUpdateEvent({
                        ...updateEvent,
                        activity_id: e.target.value,
                        price: ''
                    });
                }
            } else {
                setUpdateEvent({
                    ...updateEvent,
                    [e.target.name]: e.target.value,
                })
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            let option = window.confirm("Seguro que quieres modificar el Evento???")
            if (option === true) {
                try {
                    const response = await axios.put(`/api/updateEvent/${eventId}`, { ...updateEvent },
                        {
                            withCredentials: true
                        }
                    );

                    setSuccessMessage(response.data.message)
                    console.log(response);

                    setTimeout(() => {
                        navigate('/events')
                    }, 2000)

                } catch (error) {
                    setErrorMessage(error.response?.data?.message || "Error al actualizar el evento")
                    setTimeout(() => {
                        navigate(`/events/updateEvent/${eventId}`)
                    }, 2000)
                }
            };
        };

        // Modificar la estructura del renderizado
        if (!event.user_create_id && !user.user_id) {
            return null; // O un componente de carga
        }

        if (event.user_create_id !== user.user_id && userRole !== 1) {
            return (
                <div className='dontM'>
                    {/* ... código existente del mensaje de no autorizado ... */}
                </div>
            );
        }

        return (
            <div className='updateEvent'>
                <div className="header">
                    <Header />
                </div>
                <div className="container centerUpdateEvent">
                    <div className="updateTitleEvent text-center mt-3"><p>MODIFICAR EVENTO</p></div>

                    <div className="container tablaUpdateEvent table table-responsive">
                        <div className="headUpdateEvent">
                            <div className="reqUpdateEvent"><strong>Evento:</strong> {event.name}</div>
                            <div className="reqUpdateEvent"><strong>Descripción:</strong> {event.description}</div>
                            <div className="reqUpdateEvent"><strong>Actividad:</strong> {activity.name} ({activity.pay})</div>
                            <div className="reqUpdateEvent"><strong>Precio:</strong> {event.price}€</div>
                            <div className="reqUpdateEvent"><strong>Fecha del Evento:</strong> {new Date(event.date_activity).toLocaleString('es')}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="col-auto">
                        <div className="container">
                            <div className='container inputsUpdateEvent'>
                                <div className="updateEventName">
                                    <label className="form-label">Nombre del Evento</label>
                                    <input type="text" name="name" className="form-control" id="validationDefault01" onChange={handleChange}
                                        placeholder={event.name} required />
                                </div>
                                <div className="updateEventDescription">
                                    <label className="form-label">Descripción del Evento</label>
                                    <input type="text" name="description" className="form-control" id="validationDefault01" onChange={handleChange}
                                        placeholder={event.description} required />
                                </div>
                                <div className='updateEventActivity'>
                                    <label className="form-label">Tipo de Actividad</label>
                                    <select
                                        className="form-select"
                                        name="activityId"
                                        value={updateEvent.activity_id}
                                        onChange={handleChange}
                                        aria-label="Default select example"
                                        required
                                    >
                                        <option value="">Selecciona...</option>
                                        {activities.map(e => (
                                            <option key={e.activity_id} value={e.activity_id}>{e.name} ({e.pay})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='updateEventPrice'>
                                    <label className="form-label">Precio del Evento</label>
                                    <div className=" input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={updateEvent.price}
                                            onChange={handleChange}
                                            placeholder={event.price}
                                            disabled={activities.find(a => a.activity_id === updateEvent.activity_id)?.pay === 'Gratis'}
                                            min="0"
                                            step="0.01"
                                            aria-label="Amount (to the nearest euro)"
                                            required
                                        />
                                        <span className="input-group-text">€</span>
                                    </div>
                                </div>
                                <div className='updateEventDate'>
                                    <label className="form-label">Fecha del Evento</label>
                                    <input type="datetime-local" className="form-control" name="dateActivity" onChange={handleChange} placeholder={event.date_activity} required />
                                </div>
                            </div>

                            <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border" style={{ display: successMessage ? "block" : "none" }}>
                                <div>
                                    {successMessage}
                                </div>
                            </div>
                            <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border" style={{ display: errorMessage ? "block" : "none" }}>
                                <div>
                                    {errorMessage}
                                </div>
                            </div>

                            <div className="container updateButtonsEvent">
                                <div className=" row justify-content-between">
                                    <div className='col-auto'>
                                        <Link className="btn btn-primary" type="button" to="/events">Volver</Link>
                                    </div>
                                    <div className='col-auto'>
                                        <button className="btn btn-warning" type="submit"
                                            disabled={!updateEvent.name || !updateEvent.description || !updateEvent.activity_id||
                                                !updateEvent.price|| !updateEvent.date_activity}
                                        >Modificar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form >
                </div>
            </div >
        )
    } else {
        return (
            <div className='dontM'>
                <div className="header">
                    <Header />
                </div>
                <div className="container bodyDontM">
                    <div className='centerDontM'>
                        <div className="dontMTitle text-center"><p>No eres el creador de este evento</p></div>
                        <div className='row justify-content-center'><img src="/images/logo.png" alt="Castillo" className="logoLogout col-auto" /></div>
                    </div>
                    <div className="container buttonsDontM">
                        <div className=' row justify-content-between'>
                            <div className="col-auto">
                                <Link className="btn btn-primary" type="button" to="/events">Volver</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default UpdateEvent;