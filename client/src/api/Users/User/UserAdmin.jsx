import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './user.css'
import Header from '../../../components/header/Header'
import axios from "axios";



const UserAdmin = () => {

    const { userId } = useParams();
    const [user, setUser] = useState({})
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(
                    `/api/findUser/${userId}`, {
                    withCredentials: true
                })
                console.log(response);
                setUser(response.data.user)
            } catch (error) {
                console.error('Error fetching user:', error);
                setErrorMessage("Error al cargar el usuario");
            }
        }
        getUser()
    }, [])

    // *****FUNCION PARA BORRAR*****
    const deleteUser = async (e) => {
        e.preventDefault();
        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres eliminar el Usuario???")
        if (option === true) {

            // *****Hacemos la llamada*****  
            try {
                const response2 = await axios.delete(
                    `/api/deleteUser/${userId}`, {
                    withCredentials: true
                })
                console.log(response2);
                setSuccessMessage(response2.data.message)

                setTimeout(() => {
                    window.location.href = '/users'
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response2?.data?.message || "Error al eliminar el usuario")
                setTimeout(() => {
                    window.location.href = `/users/${userId}`
                }, 2000)
            }
        };
    };
    return (
        <div className="user">
            <div className="header">
                <Header />
            </div>
            <div className="container">
                <div className="userTitle text-center mt-3"><p>DATOS DE USUARIO</p></div>
                <div className="container centerUserAdmin">
                    <div className="container tablaUserAdmin table table-response">
                        <div className="tablaUser2">
                            <div className="headUser"><strong>Nombre:</strong> {user.name}</div>
                            <div className="headUser"><strong>Apellido:</strong> {user.surname}</div>
                            <div className="headUser"><strong>Ciudad:</strong> {user.city}</div>
                            <div className="headUser"><strong>Email:</strong> {user.email}</div>
                            <div className="headUser"><strong>Role:</strong> {user.role}</div>
                        </div>
                    </div>

                    {/* *****AVISOS DE ERRORES***** */}
                    <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border text-center" style={{ display: successMessage ? "block" : "none" }}>
                        <div>
                            {successMessage}
                        </div>
                    </div>
                    <div className="message_nok shadow-lg p-1 m-3 bg-body rounded border text-center" style={{ display: errorMessage ? "block" : "none" }}>
                        <div>
                            {errorMessage}
                        </div>
                    </div>

                    {/* *****Buttons***** */}
                    <div className="container userButtonsAdmin mb">
                        <div className="row justify-content-between">
                            <div className="volverUsers col-auto">
                                <Link className="btn btn-primary" type="button" to="/users">Volver</Link>
                            </div>
                            <div className="btn-group col-auto ">
                                <button className="btn btn-danger" onClick={deleteUser}>Borrar</button>
                                <Link className="btn btn-warning" type="button" key={user._id} to={`/users/updateUserAdmin/${userId}`}>Modificar</Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default UserAdmin;