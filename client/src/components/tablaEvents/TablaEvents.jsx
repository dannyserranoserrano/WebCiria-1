import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './tablaEvents.css'

const TablaEvents = () => {
    const role = localStorage.getItem("role");
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await axios.get("/api/events", { withCredentials: true });
                setEvents(response.data.events || []);
            } catch (error) {
                console.error('Error al cargar los eventos:', error);
                setError('Error al cargar los eventos');
                setEvents([]);
            }
        }
        getEvents();
    }, []);

    if (error) { return <div className="alert alert-danger">{error}</div>; }

    return (
        <div className="container tablaEvents mt-4 mb-4">
            <div className="headEvents table table-responsive mb-0">
                <div className="head2Events m-2">
                    <div><strong>Próximos Eventos</strong></div>
                    <div><strong>Fecha</strong></div>
                </div>
                <div>
                    {Array.isArray(events) && events
                        .filter(event => event && event.date_activity && new Date(event.date_activity) >= new Date())
                        .sort((a, b) => new Date(a.date_activity) - new Date(b.date_activity))
                        .map(e => (
                            <div key={e.event_id} className="bodyEvents">
                                {role == 1 || role == 0 ?
                                    <Link to={`/events/${e.event_id}`} className="container linkEvents">
                                        <div className='link2Events'>
                                            <div className='divEvents'>{e.name || 'Sin Nombre'}</div>
                                            <div className='divDateAct'>
                                                {e.date_activity ? new Date(e.date_activity).toLocaleString('es') : 'Sin Fecha'}
                                            </div>
                                        </div>
                                    </Link>
                                    :
                                    <div className='container linkEvents'>
                                        <div className='link2Events'>
                                            <div className='divEvents'>{e.name || 'Sin Nombre'}</div>
                                            <div className='divDateAct'>
                                                {e.date_activity ? new Date(e.date_activity).toLocaleString('es') : 'Sin Fecha'}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TablaEvents;