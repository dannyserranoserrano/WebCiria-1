import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './activity.css'
import Header from '../../../components/header/Header'
import axios from "axios";


const Activity = () => {
    const { activityId } = useParams()
    const [activity, setActivity] = useState({})
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getActivity = async () => {

            try {
                const response = await axios.get(`/api/findActivity/${activityId}`, {

                    withCredentials: true
                });
                console.log(response);
                setActivity(response.data.activity)
            } catch (error) {
                console.error('Error fetching event:', error);
                if (error.response?.status === 401) {
                    setErrorMessage("Por favor, inicia sesión para ver esta actividad.");
                } else {
                    setErrorMessage("Error al cargar la actividad.");
                }
            }
        }
        getActivity()
    }, [activityId])

    // *****FUNCION PARA BORRAR*****
    const deleteActivity = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres eliminar esta Actividad???")
        if (option === true) {


            try {
                // *****Hacemos la llamada*****
                const response2 = await axios.delete(`/api/deleteActivity/${activityId}`, {
                    withCredentials: true
                });

                setSuccessMessage(response2.data.message)

                setTimeout(() => {
                    window.location.href = '/activities'
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Error al eliminar la actividad")
                setTimeout(() => {
                    window.location.href = '/activity'
                }, 2000)
            }
        };
    };
    return (
        <div className=" activity">
            <div className="header">
                <Header />
            </div>
            <div className="container centerActivity">
                <div className="activityTitle text-center"><p>ACTIVIDAD</p></div>
                <div className="container tablaActivity">
                    <div className="headActivity">
                        <div ><strong>Actividad</strong> {activity.name}</div>
                        <div><strong>Pago</strong> {activity.pay}</div>
                    </div>
                </div>

                {/* *****AVISOS DE ERRORES***** */}
                <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
                    <div>
                        {successMessage}
                    </div>
                </div>
                <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
                    <div>
                        {errorMessage}
                    </div>
                </div>

                {/* *****Buttons***** */}
                <div className="container activityButtons">
                    <div className="row justify-content-between">
                        <div className="volverActivities col-auto">
                            <Link className="btn btn-primary" type="button" to="/activities">Volver</Link>
                        </div>
                        <div className="btn-group col-auto ">
                            <button className="btn btn-danger" onClick={deleteActivity}>Borrar </button>
                            <Link className="btn btn-warning" type="button" key={activity._id} to={`/activities/updateActivity/${activity._id}`}>Modificar</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Activity;