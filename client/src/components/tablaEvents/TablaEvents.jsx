import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './tablaEvents.css'

const TablaEvents = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await axios.get("/api/events", {
                    withCredentials: true
                });
                setEvents(response.data.events || []);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Error loading events');
                setEvents([]);
            }
        }
        getEvents();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container tablaEvents mt-4 mb-4">
            <div className="headEvents table table-responsive mb-0">
                <div className="head2Events m-2">
                    <div><strong>Próximos Eventos</strong></div>
                    <div><strong>Fecha</strong></div>
                </div>
                <div>
                    {Array.isArray(events) && events
                        .filter(event => event && event.dateActivity && new Date(event.dateActivity) >= new Date())
                        .sort((a, b) => new Date(a.dateActivity) - new Date(b.dateActivity))
                        .map(e => (
                            <div key={e._id} className="bodyEvents">
                                <Link to={`/events/${e._id}`} className="container linkEvents">
                                    <div className='link2Events'>
                                        <div className='divEvents'>{e.name || 'Untitled Event'}</div>
                                        <div className='divDateAct'>
                                            {e.dateActivity ? new Date(e.dateActivity).toLocaleString('es') : 'Date not set'}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default TablaEvents;