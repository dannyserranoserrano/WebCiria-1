import React from "react";
import { Link } from "react-router-dom"
import './activities.css'
import Header from '../../components/header/Header';
import TablaActivities from '../../components/tablaActivities/TablaActivities'


const Activities = () => {
    return (
        <div className="activities">
            <div className="header">
                <Header />
            </div>
            <div className="container centerActivities">
                <div className="activitiesTitle text-center"><p>ACTIVIDADES</p></div>
                    <div className="container activitiesTable">
                        <TablaActivities />
                    </div>
                {/* *****Buttons***** */}
                <div className="container activitiesButtons">
                    <div className="row justify-content-between">
                        <div className="volverActivities col-auto">
                            <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                        </div>
                        <div className="addActivities col-auto">
                            <Link className="btn btn-success" type="button" to="/activities/addActivity">Añadir Actividad</Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Activities;