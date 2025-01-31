import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import "./updateUser.css"


const UpdateUser = () => {

    const [updateUser, setUpdateUser] = useState({
        name: "",
        surname: "",
        city: "",
        password: "",
        email: "",
    });

    const [user, setUser] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    // *****FUNCION PARA CREAR LA TABLA CON LOS DATOS ANTIGUOS*****
    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get('/api/findUser', {
                withCredentials: true
            })
            console.log(response);
            setUser(response.data.user)
        }
        getUser()
    }, [])


    // *****FUNCION ACTUALIZACION DE DATOS*****
    const handleChange = (e) => {
        setUpdateUser({
            ...updateUser,
            [e.target.name]: e.target.value,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres Modificar los datos???")
        if (option === true) {

            // *****Hacemos la llamada*****
            try {
                const response = await axios.put(
                    '/api/updateUser',
                    { ...updateUser }, {
                        withCredentials: true
                })

                setSuccessMessage(response.data.message)
                console.log(response);

                setTimeout(() => {
                    navigate("/user")
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response.data.message)
                setTimeout(() => {
                    window.location.href = '/users/updateUser'
                }, 2000)
            }
        };
    };
    return (
        <div className='updateUser'>
            <div className="header">
                <Header />
            </div>
            <div className="container centerUpdateUser">
                <div className="updateTitleUser text-center mt-3"><p>MODIFICAR DATOS DEL USUARIO</p></div>

                {/* *****VISUALIZAMOS ANTES DE MODIFICAR***** */}
                <div className="container tablaUpdateUser table table-responsive">
                    <div className="headUpdateUser">
                        <div className="reqUpdateUser"><strong>Nombre:</strong> {user.name}</div>
                        <div className="reqUpdateUser"><strong>Apellido:</strong> {user.surname}</div>
                        <div className="reqUpdateUser"><strong>Ciudad:</strong> {user.city}</div>
                    </div>
                </div>

                {/* *****FORMULARIO PARA MODIFICAR***** */}
                <form onSubmit={handleSubmit} className="col-auto">
                    <div className="container">
                        <div className="table table-responsive">
                            <div className='container inputsUpdateUser '>
                                <div className="updateUserName">
                                    <label className="form-label">Nombre de Usuario</label>
                                    <input type="text" name="name" value={updateUser.name} className="form-control" onChange={handleChange}
                                        placeholder={user.name} required />
                                </div>
                                <div className="updateUserSurname">
                                    <label className="form-label">Apellido de Usuario</label>
                                    <input type="text" name="surname" value={updateUser.surname} className="form-control" onChange={handleChange}
                                        placeholder={user.surname} required />
                                </div>
                                <div className='updateUserCity'>
                                    <label className="form-label ">Ciudad de Origen</label>
                                    <input type="text" name="city" value={updateUser.city} className="form-control" onChange={handleChange}
                                        placeholder={user.city} required />
                                </div>
                                <div className='updateUserPassword'>
                                    <label className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" name="password" value={updateUser.password} onChange={handleChange}
                                        placeholder="Contraseña" required />
                                </div>

                            </div>
                        </div>

                        {/* *****AVISOS DE ERRORES***** */}
                        <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border" style={{ display: successMessage ? "block" : "none" }}>
                            <div>
                                {successMessage}
                            </div>
                        </div>
                        <div className="message_ok shadow-lg p-1 m-3 bg-body rounded border" style={{ display: errorMessage ? "block" : "none" }}>
                            <div>
                                {errorMessage}
                            </div>
                        </div>

                        {/* *****Buttons***** */}
                        <div className="container updateButtonsUser">
                            <div className="row justify-content-between">
                                <div className='col-auto'>
                                    <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                                </div>
                                <div className='col-auto'>
                                    <button className="btn btn-warning" type="submit"
                                        disabled={!updateUser.name.length || !updateUser.surname.length || !updateUser.city.length || !updateUser.password.length}
                                    >Modificar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form >
            </div>
        </div >
    )
};


export default UpdateUser;