import React from "react";
import { Link } from "react-router-dom"
import './files.css'
import Header from '../../components/header/Header';
import TablaFiles from '../../components/tablaFiles/TablaFiles'


const Files = () => {

    const role = localStorage.getItem("role")



    // ******GALERIA UNLOGGED*****

    const Galeria = () => (
        <div className="files">
            <div className="header">
                <Header />
            </div>
            <div className="container centerFiles">
                <div className="filesTitle text-center"><p>GALERIA</p></div>
                <div className="container filesTable w-100">
                    <TablaFiles />
                </div>
                {/* *****Buttons***** */}
                <div className="container filesButtons">
                    <div className="row justify-content-start">
                        <div className="">
                            <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // ******GALERIA ADMIN*****

    const GaleriaAdmin = () => (
        <div className="files">
            <div className="header">
                <Header />
            </div>
            <div className="container centerFiles">
                <div className="filesTitle text-center"><p>GALERIA</p></div>
                <div className="container filesTable w-100">
                    <TablaFiles />
                </div>
                {/* *****Buttons***** */}
                <div className="container filesButtons">
                    <div className=" row justify-content-between">
                         <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                        </div>
                        <div className="btn-group col-auto ">
                            <div className="addFiles">
                                <Link className="btn btn-success" type="button" to="/files/addFile" disabled>Añadir Imagen</Link>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    )

    let galeria = role == 0 ? GaleriaAdmin() : role == 1 ? GaleriaAdmin() : Galeria()
    return (
        <div>
            {galeria}
        </div>
    )
}
export default Files;