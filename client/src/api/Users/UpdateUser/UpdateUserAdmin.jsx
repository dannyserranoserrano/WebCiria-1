import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import "./updateUser.css"


const UpdateUser = () => {

    const [updateUser, setUpdateUser] = useState({
        city: "",
        role: "",
    });

    const { userId } = useParams()
    const [user, setUser] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    // *****FUNCION PARA CREAR LA TABLA CON LOS DATOS ANTIGUOS*****
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/api/findUser/${userId}`, {
                    withCredentials: true
                });
                console.log(response);
                setUser(response.data.user)
            } catch (error) {
                console.error('Error fetching user:', error);
                setErrorMessage("Error al cargar el usuario");
                setTimeout(() => {
                    navigate('/users');
                }, 2000);
            }
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
    console.log(updateUser);
    const handleSubmit = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres modificar el Usuario???")
        if (option === true) {

            // *****Hacemos la llamada*****
            try {
                const response2 = await axios.put(
                    `/api/updateUser/${userId}`,
                    { ...updateUser },
                    { withCredentials: true }
                );
                setSuccessMessage(response2.data.message)
                console.log(response2);

                setTimeout(() => {
                    navigate(`/users/${userId}`)
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response2?.data?.message || "Error al actualizar el usuario");
                setTimeout(() => {
                    navigate(`/users/updateUser/${userId}`);
                }, 2000);
            }
        };
    };
    return (
        <div className='updateUser'>
            <div className="header">
                <Header />
            </div>
            <div className="container centerUpdateUserAdmin">
                <div className="updateTitleUser text-center mt-3"><p>MODIFICAR DATOS DEL USUARIO</p></div>

                {/* *****VISUALIZAMOS ANTES DE MODIFICAR***** */}
                <div className="container tablaUpdateUser">
                    <div className="headUpdateUser">
                        <div className="reqUpdateUser"><strong>Nombre:</strong> {user.name}</div>
                        <div className="reqUpdateUser"><strong>Apellido:</strong> {user.surname}</div>
                        <div className="reqUpdateUser"><strong>Ciudad:</strong> {user.city}</div>
                        <div className="reqUpdateUser"><strong>Role:</strong> {user.role}</div>
                    </div>
                </div>

                {/* *****FORMULARIO PARA MODIFICAR***** */}
                <form onSubmit={handleSubmit} className="col-auto">
                    <div className="">
                        <div className='container inputsUpdateUser w-100'>
                            <div className='updateUserCity'>
                                <label className="form-label">Ciudad de Origen</label>
                                <input type="text" name="city" value={updateUser.city} className="form-control" onChange={handleChange}
                                    placeholder={user.city} required />
                            </div>
                            <div className='updateUserRole'>
                                <label className="form-label">Role</label>
                                <select className="form-select" name="role" value={updateUser.role} onChange={handleChange} aria-label="Default select example">
                                    <option selected>Selecciona...</option>
                                    <option value="0">Usuario</option>
                                    <option value="1">Administrador</option>
                                </select>
                            </div>
                        </div>

                        {/* *****AVISOS DE ERRORES***** */}
                        <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border" style={{ display: successMessage ? "block" : "none" }}>
                            <div>
                                {successMessage}
                            </div>
                        </div>
                        <div className="message_ok shadow-lg p-3 m-3 bg-body rounded border" style={{ display: errorMessage ? "block" : "none" }}>
                            <div>
                                {errorMessage}
                            </div>
                        </div>

                        {/* *****Buttons***** */}
                        <div className="container updateButtonsUserAdmin">
                            <div className=" row justify-content-between">
                                <div className='col-auto'>
                                    <Link className="btn btn-primary" type="button" to="/Users">Volver</Link>
                                </div>
                                <div className='col-auto'>
                                    <button className="btn btn-warning" type="submit"
                                        disabled={!updateUser.city.length || !updateUser.role.length}
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