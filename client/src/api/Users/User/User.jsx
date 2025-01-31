import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import './user.css'
import Header from '../../../components/header/Header'
import axios from "axios";


const User = () => {

    const [user, setUser] = useState({})
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get(
                '/api/findUser', {
                    withCredentials: true
            })
            console.log(response);
            setUser(response.data.user)

        }
        getUser()
    }, [])

    // *****FUNCION PARA BORRAR*****
    const deleteUser = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres eliminar tu cuenta de Usuario???")
        if (option === true) {

            // *****Hacemos la llamada*****
            const response2 = await axios.delete(
                '/api/deleteUser', {
                    withCredentials: true
            })
            try {
                setSuccessMessage(response2.data.message)
                
            // Clear local storage
            localStorage.removeItem('role');
            localStorage.removeItem('name');

            // Clear cookies on the client side as a backup
            document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
            document.cookie = `token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;

            // Force redirect to ensure clean state
            window.location.href = '/login';

                setTimeout(() => {
                    window.location.href = '/'
                }, 2000)

            } catch (error) {
                setErrorMessage(response2.data.error.message)
                setTimeout(() => {
                    window.location.href = '/user'
                }, 2000)
            }
        };
    }

    return (
        <div className="user">
            <div className="header">
                <Header />
            </div>
            <div className="container centerUser">
                <div className="userTitle text-center"><p>ESTOS SON TUS DATOS</p></div>
                <div className="container ">
                    <div className="container tablaUser table table-responsive">
                        <div className="tablaUser2">
                            <div className="headUser "><strong>Nombre:</strong>{user.name}</div>
                            <div className="headUser"><strong>Apellido:</strong>{user.surname}</div>
                            <div className="headUser"><strong>Ciudad:</strong>{user.city}</div>
                            <div className="headUser"><strong>Email:</strong>{user.email}</div>
                        </div>
                    </div>

                    {/* *****AVISOS DE ERRORES***** */}
                    <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
                        <div>{successMessage}</div>
                    </div>
                    <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
                        <div>{errorMessage}</div>
                    </div>

                    {/* *****Buttons***** */}
                    <div className="container userButtons mb">
                        <div className="row justify-content-between">
                            <div className="volverUsers col-auto">
                                <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                            </div>
                            <div className="btn-group col-auto ">
                                <button className="btn btn-danger" onClick={deleteUser}>Borrar </button>
                                <Link className="btn btn-warning" type="button" key={user._id} to={'/users/updateUser'}>Modificar</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default User;