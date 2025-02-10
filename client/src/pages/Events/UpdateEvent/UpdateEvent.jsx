import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import "./updateEvent.css"


const UpdateEvent = () => {
    const [userRole, setUserRole] = useState(null);

    const [updateEvent, setUpdateEvent] = useState({
        activityId: "",
        name: "",
        description: "",
        price: "",
        dateActivity: "",
    });

    const { eventId } = useParams();
    const [user, setUser] = useState({})
    const [event, setEvent] = useState({});
    const [activity, setActivity] = useState({})
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
            console.log(response.data.event.userCreate);
            setEvent(response.data.event)
            setActivity(response.data.event.activity)
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
            const response3 = await axios.get('/api/findUser', {
                withCredentials: true
            });
            console.log(response3);
            setUser(response3.data.user)
            setUserRole(response3.data.user.role);
        } catch (error) {
            console.error('Error fetching user:', error);
            setErrorMessage("Error al cargar el usuario");
        }
    }

    // ******BUSQUEDA DE ACTIVIDADES*****    
        const getActivities = async () => {
            try {
                const response2 = await axios.get("/api/activities", {
                    withCredentials: true
                });
                console.log(response2.data.activity);
                setActivities(response2.data.activity);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setErrorMessage("Error al cargar las actividades");
            }
        }

// **********ACTUALIZAR EVENTO**********
    if ((event.userCreate == user._id) || (userRole == 1)) {
        const handleChange = (e) => {
            if (e.target.name === 'activityId') {
                const selectedActivity = activities.find(a => a._id === e.target.value);
                if (selectedActivity && selectedActivity.pay === 'Gratis') {
                    setUpdateEvent({
                        ...updateEvent,
                        activityId: e.target.value,
                        price: '0'
                    });
                } else {
                    setUpdateEvent({
                        ...updateEvent,
                        activityId: e.target.value,
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
                    const response = await axios.put(
                        `/api/updateEvent/${eventId}`,
                        { ...updateEvent },
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
                            <div className="reqUpdateEvent"><strong>Fecha del Evento:</strong> {new Date(event.dateActivity).toLocaleString('es')}</div>
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
                                        value={updateEvent.activityId} 
                                        onChange={handleChange} 
                                        aria-label="Default select example" 
                                        required
                                    >
                                        <option value="">Selecciona...</option>
                                        {activities.map(e => (
                                            <option key={e._id} value={e._id}>{e.name} ({e.pay})</option>
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
                                            disabled={activities.find(a => a._id === updateEvent.activityId)?.pay === 'Gratis'}
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
                                    <input type="datetime-local" className="form-control" name="dateActivity" onChange={handleChange} placeholder={event.dateActivity} required />
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
                                            disabled={!updateEvent.name.length || !updateEvent.description.length || !updateEvent.activityId.length ||
                                                !updateEvent.price.length || !updateEvent.dateActivity.length}
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