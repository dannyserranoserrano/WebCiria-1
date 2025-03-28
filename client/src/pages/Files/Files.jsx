import React from "react";
import { Link } from "react-router-dom"
import './files.css'
import Header from '../../components/header/Header';
import TablaFiles from '../../components/tablaFiles/TablaFiles'


const Files = () => {

    const role = localStorage.getItem("role")
    return (
        <div className="files">
            <div className="header">
                <Header />
            </div>
            <section className="container home">
                <div className="filesTitle text-center"><p>GALERIA</p></div>
                <div className="container carruselIndex">
                    <TablaFiles />
                </div>
                {/* *****Buttons***** */}
                <div className="container filesButtons">
                    <div className=" row justify-content-center">
                         <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                        </div>
                        <div className="btn-group col-auto" style={{ display: role ? "block" : "none" }}>
                            <div className="addFiles">
                                <Link className="btn btn-success" type="button" to="/files/addFile" >Añadir Imagen</Link>
                            </div>
                        </div>                      
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Files;