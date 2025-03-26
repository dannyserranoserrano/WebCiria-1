import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './activity.css'
import Header from '../../../components/header/Header'
import axios from "axios";


const Activity = () => {

    const role = localStorage.getItem("role");
    const { activityId } = useParams();
    const [activity, setActivity] = useState({})

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        console.log("Activity ID:", activityId);

        getActivity();
    }, [activityId]);

    const getActivity = async () => {
        try {
            if (role) {
                const activityResponse = await axios.get(`/api/findActivity/${activityId}`, {
                    withCredentials: true
                });
                const activityData = activityResponse.data.activity;
                setActivity(activityData);
            } else {
                setErrorMessage("Por favor, inicia sesión para ver esta actividad.");
            }
        } catch (error) {
            console.error('Error al cargar la actividad:', error);
            setErrorMessage("Error al cargar la actividad");
        }
    };

    // *****FUNCION PARA BORRAR*****
    const deleteActivity = async (e) => {
        e.preventDefault();

        let option = window.confirm("¡ATENCIÓN! Si eliminas esta actividad, también se eliminarán todos los eventos asociados. ¿Estás seguro de que quieres continuar?")
        if (option === true) {
            try {
                const response2 = await axios.delete(`/api/deleteActivity/${activityId}`, {
                    withCredentials: true
                });

                setSuccessMessage(response2.data.message);
                setTimeout(() => {
                    window.location.href = '/activities';
                }, 2000);

            } catch (error) {
                if (error.response?.status === 409) {
                    setErrorMessage("No se puede eliminar esta actividad porque tiene eventos asociados");
                } else {
                    setErrorMessage(error.response?.data?.message || "Error al eliminar la actividad");
                }
            }
        }
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
                        <div ><strong>Actividad: </strong> {activity.name}</div>
                        <div>
                            Esta actividad es {activity.pay === 'Pago' ? 
                                <strong> de Pago</strong> : 
                                activity.pay === 'Gratis' ? 
                                <strong> Gratis</strong> : 
                                <strong> {activity.pay}</strong>
                            }
                        </div>
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
                            <Link className="btn btn-warning" type="button" key={activity.activity_id} to={`/activities/updateActivity/${activity.activity_id}`}>Modificar</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Activity;