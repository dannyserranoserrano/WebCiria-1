/* eslint-disable eqeqeq */
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  return (
    <div className="header">
      <nav className="navbar navbar-expand-xl navbar-light bg-light ">
        <div className="container-fluid">
          <div className="welcomeHeader">
            {/* Titulo y Logo */}
            <Link className="navbar-brand m-0 p-0" to="/">
              <img
                src="/images/logo.png"
                alt=""
                width="130"
                height="50"
                className="d-inline-block align-text-top ms-5"
              />
              <p className="titleHead ms-2 m-0">Bienvenid@s a CIRIA</p>
            </Link>

            {/* Saludo Unloggin */}
            <p className="p navbar-brand h6 text-center w-25" style={{ display: !role ? "block" : "none" }}>
              Hola Usuario
              <br />
              No estas registrado
            </p>

            {/* Saludo User */}
            <p className="p navbar-brand text-center w-100" style={{ display: role == 0 ? "block" : "none" }}>
              Hola {name},<br />
              estás Loguead@
            </p>

            {/* Saludo Admin */}
            <p className="p navbar-brand text-center w-100" style={{ display: role == 1 ? "block" : "none" }}>
              Hola {name},<br />
              eres Administrador/@
            </p>
          </div>

          {/* Desplegable User */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse menu col-3" id="navbarNavDropdown" >
            <ul className="navbar-nav ">

              {/* *****UNLOGGED***** */}
              <div className="btn-group" role="group" aria-label="Basic outlined example" style={{ display: !role ? "block" : "none" }}>
                <Link
                  className="btn btn-outline-success"
                  type="button"
                  to="/register"
                >
                  Registrate
                </Link>
                <Link
                  className="btn btn-outline-secondary"
                  type="button"
                  to="/login"
                >
                  Logueate
                </Link>
              </div>

              {/* *****MENU ADMIN y USER***** */}
              <li className="nav-item dropdown" style={{ display: role ? "block" : "none" }}>
                <button
                  className="btn btn-sm btn-outline-primary dropdown-toggle mt-1"
                  id="dropdownMenuLink"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ display: role == 0 ? "block" : "none" }}
                >
                  USUARIO
                </button>
                <button
                  className="btn btn-sm btn-outline-primary dropdown-toggle mt-1"
                  id="dropdownMenuLink"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ display: role == 1 ? "block" : "none" }}
                >
                  ADMINISTRADOR
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <Link className="dropdown-item btn-sm " to="/user">
                      DATOS PERSONALES
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item btn-sm " to="/reserves">
                      INSCRIPCIONES
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/activities"
                      style={{ display: role == 1 ? "block" : "none" }}
                    >
                      ACTIVIDADES
                    </Link>
                  </li>
                  <li className="nav-item" style={{ display: role == 1 ? "block" : "none" }}>
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/users"
                    >
                      USUARIOS
                    </Link>
                  </li>
                  <li className="nav-item" style={{ display: role == 1 ? "block" : "none" }}>
                    <Link
                      className="nav-link active "
                      aria-current="page"
                      to="/reserves"
                    >
                      RESERVAS
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/files"
                >
                  GALERÍA
                </Link>
              </li>
              <li className="nav-item" style={{ display: role ? "block" : "none" }}>
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/events"
                >
                  EVENTOS
                </Link>
              </li>
              <li className="nav-item" style={{ display: role ? "block" : "none" }}>
                <Link className="nav-link active" type="button" to="/logout">
                  SALIR
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
