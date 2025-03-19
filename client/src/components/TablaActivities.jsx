import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import './tablaActivities.css'

const TablaActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getActivities = async () => {
            try {
                const response = await axios.get("0/api/activities", { withCredentials: true });
                const data = await response.json();
                console.log('API Response:', data); // Debug log

                if (!data || data.success === false) {
                    setError(data?.message || 'Error loading activities');
                    setActivities([]);
                } else {
                    const activitiesList = data?.activities || [];
                    console.log('Activities List:', activitiesList); // Debug log
                    setActivities(activitiesList);
                }
            } catch (err) {
                console.error('Fetch Error:', err); // Debug log
                setError(err.message);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
    }, []);

    // Debug log for render phase
    console.log('Rendering with activities:', activities);

    if (loading) return <div>Cargando actividades...</div>;
    if (error) return <div>{error}</div>;
    if (!Array.isArray(activities) || activities.length === 0) {
        return <div>No hay actividades disponibles</div>;
    }

    return (
        <div className="tablaActivities container mt-4 mb-4">
            <div className=" headActivities table table-responsive mb-0">
                <div className="head2Activities mt-2">
                    <div ><strong>Actividad</strong></div>
                    <div><strong>Pago</strong></div>
                </div>
                <div>
                    {activities.map((activity) => (
                        <div key={activity?.id || Math.random()} className="bodyActivities">
                            <Link to={`/activities/${e._id}`} className="container linkActivities"  >
                                <div className='link2Activities'>
                                    <h3>{activity?.name || 'Sin nombre'}</h3>
                                    <p>{activity?.pay || 'Sin valor depago'}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default TablaActivities;