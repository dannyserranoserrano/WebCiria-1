import React from "react";
import { Link } from "react-router-dom"
import './users.css'
import Header from '../../components/header/Header';
import TablaUsers from '../../components/tablaUsers/TablaUsers'


const Users = () => {
   
    return (
        <div className="users">
            <div className="header">
                <Header />
            </div>
            <div className="container centerUsers">
                <div className="usersTitle text-center"><p>USUARIOS</p></div>
                <div className="container usersTable">
                    <TablaUsers />
                </div>
                {/* *****Buttons***** */}
                <div className="container usersButtons">
                    <div className="row justify-content-start">
                        <div className="volverUser col-auto">
                            <Link className="btn btn-primary " type="button" to="/">Volver</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Users;