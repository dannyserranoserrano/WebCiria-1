import React from "react";
import { Link } from "react-router-dom"
import './events.css'
import Header from '../../components/header/Header';
import TablaEvents from '../../components/tablaEvents/TablaEvents'


const Events = () => {

    const role = localStorage.getItem("role") || null;


    const Eventos = () => (

        <div className="events">
            <div className="header">
                <Header />
            </div>
            <div className="container centerEvents">
                <div className="eventsTitle text-center"><p>EVENTOS</p></div>
                <div className="container eventsTable">
                    <TablaEvents />
                </div>
                {/* *****Buttons***** */}
                <div className="container eventsButtons">
                    <div className="row justify-content-start">
                        <div className="volverEvents col-auto">
                            <Link className="btn btn-primary " type="button" to="/">Volver</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const EventosUser = () => (

        <div className="events">
            <div className="header">
                <Header />
            </div>
            <div className="container centerEvents">
                <div className="eventsTitle text-center"><p>EVENTOS</p></div>
                <div className="container eventsTable">
                    <TablaEvents />
                </div>
                {/* *****Buttons***** */}
                <div className="container eventsButtons">
                    <div className="row justify-content-between">
                        <div className="volverEvents col-auto">
                            <Link className="btn btn-primary " type="button" to="/">Volver</Link>
                        </div>
                        <div className="addEvents col-auto">
                            <Link className="btn btn-success" type="button" to="/events/addEvent">Añadir Evento</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

    // *****Operacion ternaria multiple*****
    // Safer role checking
    let eventos = role === null ? Eventos() : 
                 (role === "0" || role === "1") ? EventosUser() : 
                 Eventos();
    
    return (
        <div>
            {eventos}
        </div>
    )
}
export default Events;