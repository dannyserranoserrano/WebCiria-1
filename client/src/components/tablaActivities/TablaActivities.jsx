import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './tablaActivities.css'

const TablaActivities = () => {

    const [activities, setActivities] = useState([])
    useEffect(() => {
        const getActivities = async () => {
            const response = await axios.get("/api/activities", {
                withCredentials: true
            })
            console.log(response);
            setActivities(response.data.activity);
        }
        getActivities();
    }, []);


    return (
        <div className="tablaActivities container mt-4 mb-4">
            <div className=" headActivities table table-responsive mb-0">
                <div className="head2Activities mt-2">
                    <div ><strong>Actividad</strong></div>
                    <div><strong>Pago</strong></div>
                </div>
                <div>
                    {activities.map(e => (
                        <div key={e._id} className="bodyActivities">
                            <Link to={`/activities/${e._id}`} className="container linkActivities"  >
                                <div className='link2Activities'>
                                    <div className="divActivName">{e.name}</div>
                                    <div className="divActivPay">{e.pay}</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TablaActivities;