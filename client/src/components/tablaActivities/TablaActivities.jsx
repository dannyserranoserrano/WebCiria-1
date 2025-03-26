import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import './tablaActivities.css'

const TablaActivities = () => {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getActivities = async () => {
            try {
                const response = await axios.get("/api/activities", { withCredentials: true });
                setActivities(response.data.activities || []);

            } catch (error) {
                console.error('Error al cargar las actividades:', error); // Debug log
                setError('Error al cargar las actividades');
                setActivities([]);
            }
        }
        getActivities();
    }, []);

    if (error) { return <div className="alert alert-danger">{error}</div>; };

    return (
        <div className="tablaActivities container mt-4 mb-4">
            <div className=" headActivities table table-responsive mb-0">
                <div className="head2Activities mt-2">
                    <div ><strong>Actividad</strong></div>
                    <div><strong>Pago</strong></div>
                </div>
                <div>
                    {Array.isArray(activities) && activities
                        .map(activity => (
                            <div key={activity.activity_id} className="bodyActivities">
                                <Link 
                                    to={`/activities/${activity.activity_id}`} 
                                    className="container linkActivities"
                                >
                                    <div className='link2Activities'>
                                        <h3>{activity.name || 'Sin nombre'}</h3>
                                        <p>{activity.pay || 'Sin valor de pago'}</p>
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


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import './tablaActivities.css'

// const TablaActivities = () => {
//     const [activities, setActivities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const getActivities = async () => {
//             try {
//                 const response = await axios.get("/api/activities", { withCredentials: true });
//                 console.log('API Response:', response.data); // Debug log

//                 if (!response.data || response.data.success === false) {
//                     setError(response.data?.message || 'Error loading activities');
//                     setActivities([]);
//                 } else {
//                     const activitiesList = response.data?.activities || [];
//                     console.log('Activities List:', activitiesList); // Debug log
//                     setActivities(activitiesList);
//                 }
//             } catch (err) {
//                 console.error('Axios Error:', err); // Debug log
//                 setError(err.message);
//                 setActivities([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getActivities();
//     }, []);

//     // Debug log for render phase
//     console.log('Rendering with activities:', activities);

//     if (loading) {return <div className="message">Cargando actividades...</div>};
//     if (error) {return <div className="message">{error}</div>}
//     if (!Array.isArray(activities) || activities.length === 0) {
//         return <div className="message">No hay actividades disponibles</div>;
//     }

//     return (
//         <div className="tablaActivities container mt-4 mb-4">
//             <div className=" headActivities table table-responsive mb-0">
//                 <div className="head2Activities mt-2">
//                     <div ><strong>Actividad</strong></div>
//                     <div><strong>Pago</strong></div>
//                 </div>
//                 <div>
//                     {activities.map((e) => (
//                         <div key={e?.id || Math.random()} className="bodyActivities">
//                             <Link to={`/activities/${e._id}`} className="container linkActivities"  >
//                                 <div className='link2Activities'>
//                                     <h3>{e?.name || 'Sin nombre'}</h3>
//                                     <p>{e?.pay || 'Sin valor depago'}</p>
//                                 </div>
//                             </Link>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default TablaActivities;