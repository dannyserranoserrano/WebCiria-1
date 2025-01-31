import React from "react";
import './Header.css';
import { Link } from "react-router-dom";


const Header = () => {



    const role = localStorage.getItem("role")
    const name = localStorage.getItem("name")


    // *****NAVBAR UNLOGGIN*****
    const NavBar = () => (
        <div className="header">
            <nav className="navbar navbar-expand-xl navbar-light bg-light">
                <div className="container-fluid">
                    <div className="welcomeHeader">
                        <Link className="navbar-brand m-0 p-0" to="/"><img src="/images/logo.png" alt="" width="130" height="50" className="d-inline-block align-text-top" /><p className="titleHead ms-2 m-0">Bienvenidos a CIRIA</p></Link>
                        <p className="p navbar-brand h6 text-center w-25">Hola Usuario<br />No estas registrado</p>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse menu col-3" id="navbarNavDropdown">
                        <ul className="navbar-nav ">
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                        <Link className="btn btn-outline-success" type="button" to="/register">Registrate</Link>
                        <Link className="btn btn-outline-secondary" type="button" to="/login">Logueate</Link>   
                            </div>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/files">Galería</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );

    // *****NAVBAR USER*****

    const NavBarUser = () => (
        <div className="header">
            <nav className="navbar navbar-expand-xl navbar-light bg-light">
                <div className="container-fluid">
                    <div className="welcomeHeader">
                        <Link className="navbar-brand m-0 p-0" to="/"><img src="/images/logo.png" alt="" width="130" height="50" className="d-inline-block align-text-top ms-5" /><p className="titleHead ms-2 m-0">Bienvenid@s a CIRIA</p></Link>
                        <p className="p navbar-brand text-center w-100">Hola {name},<br />estás Loguead@</p>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse menu col-3" id="navbarNavDropdown">
                        <ul className="navbar-nav ">
                            <li className="nav-item dropdown">
                                <button className="btn btn-sm btn-outline-primary dropdown-toggle mt-1" id="dropdownMenuLink" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Usuario
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li><Link className="dropdown-item btn-sm" to="/user">Datos Personales</Link></li>
                                    <li><Link className="dropdown-item btn-sm" to="/reserve">Inscripciones</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/files">Galería</Link>
                            </li>
                            {/* *****LOGGED***** */}
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/events">Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" type="submit" to="/logout">Cerrar Sesion</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
        </div >
    );

    // *****NAVBAR ADMIN*****

    const NavBarAdmin = () => (
        <div className="header">
            <nav className="navbar navbar-expand-xl navbar-light bg-light ">
                <div className="container-fluid">
                    <div className="welcomeHeader">
                        <Link className="navbar-brand m-0 p-0" to="/"><img src="/images/logo.png" alt="" width="130" height="50" className="d-inline-block align-text-top ms-5" /><p className="titleHead ms-2 m-0">Bienvenid@s a CIRIA</p></Link>
                        <p className="p navbar-brand text-center w-100">Hola {name},<br />eres Administrador/@</p>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse menu col-3" id="navbarNavDropdown">
                        <ul className="navbar-nav ">
                            <li className="nav-item dropdown">
                                <button className="btn btn-sm btn-outline-primary dropdown-toggle mt-1" id="dropdownMenuLink" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Administrador
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li><Link className="dropdown-item btn-sm " to="/user">Datos Personales</Link></li>
                                    <li><Link className="dropdown-item btn-sm " to="/reserve">Inscripciones</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/files">Galería</Link>
                            </li>
                            {/* *****ADMINISTRATOR***** */}
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/events">Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/activities">Actividades</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/users">Usuarios</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active " aria-current="page" to="/reserves" >Reservas</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" type="button" to="/logout">Cerrar Sesión</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
        </div>
    );

    // *****Operacion ternaria multiple*****
    let nav = role == 0 ? NavBarUser() : role == 1 ? NavBarAdmin() : NavBar()
    return (
        <div>
            {nav}
        </div>
    )
}

export default Header;