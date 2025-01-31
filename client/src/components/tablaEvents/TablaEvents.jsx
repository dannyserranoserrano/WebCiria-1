import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './tablaEvents.css'

const TablaEvents = () => {

    const [events, setEvents] = useState([])

    useEffect(() => {
        const getEvents = async () => {
            const response = await axios.get("/api/events", {
                withCredentials: true
            })
            console.log(response);
            setEvents(response.data.events);
        }
        getEvents();
    }, []);


    return (
        <div className="container tablaEvents mt-4 mb-4">
            <div className="headEvents table table-responsive mb-0">
                <div className="head2Events m-2">
                    <div><strong>Próximos Eventos</strong></div>
                    <div><strong>Fecha</strong></div>
                </div>
                <div>
                    {events.map(e => (
                        <div key={e._id} className="bodyEvents">
                            <Link to={`/events/${e._id}`} className="container linkEvents">
                                <div className='link2Events'>
                                    <div className='divEvents'>{e.name}</div>
                                    <div className='divDateAct'>{new Date(e.dateActivity).toLocaleString('es')}</div>
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