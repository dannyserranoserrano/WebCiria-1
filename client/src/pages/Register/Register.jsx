import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Header from '../../components/header/Header';
import "./register.css"

const Register = () => {

    const [userRegister, setUserRegister] = useState({
        name: "",
        surname: "",
        city: "",
        email: "",
        password: "",
    });

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setUserRegister({
            ...userRegister,
            [e.target.name]: e.target.value,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // *****Hacemos la llamada*****
        try {
            const response = await axios.post(
                '/api/newUser',
                { ...userRegister })
            setSuccessMessage(response.data.message)

            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (error) {
            setErrorMessage(error.response.data.message)
            setTimeout(() => {
                window.location.href = "/register"
            }, 2000)
        }
    };

    return (
        <div className='register'>
            <div className="header">
                <Header />
            </div>
            <div className="container">
                <div className="registerTitle text-center mt-3"><p>REGISTRATE</p></div>

                <form onSubmit={handleSubmit} className="col-auto">
                    <div className="container">
                        <div className="table table-responsive">
                            <div className='container inputsRegister'>
                                <div className="registerName">
                                    <label className="form-label">Nombre</label>
                                    <input type="text" name="name" className="form-control" id="validationDefault01" onChange={handleChange}
                                        placeholder="Introduce Tu Nombre" required />
                                </div>
                                <div className="registerSurname">
                                    <label className="form-label">Apellido</label>
                                    <input type="text" name="surname" className="form-control" id="validationDefault02" onChange={handleChange}
                                        placeholder="Introduce tu Apellido" required />
                                </div>
                                <div className="registerCity">
                                    <label className="form-label">Ciudad</label>
                                    <input type="text" name="city" className="form-control" id="validationDefault03" onChange={handleChange}
                                        placeholder="Ciudad de residencia" required />
                                </div>
                                <div className="registerEmail">
                                    <label className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="inputGroupPrepend2">@</span>
                                        <input type="email" name="email" className="form-control" id="validationDefaultUsername"
                                            aria-describedby="inputGroupPrepend2" onChange={handleChange} placeholder="Introduce Tu Email" required />
                                    </div>
                                </div>
                                <div className="registerPassword">
                                    <label className="form-label">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="inputGroupPrepend2">***</span>
                                        <input type="password" name="password" className="form-control" id="validationDefaultPassword"
                                            aria-describedby="inputGroupPrepend2" onChange={handleChange} placeholder="Escribe Un Password" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* *****AVISOS DE ERRORES***** */}
                        <div className="message" style={{ display: successMessage ? "block" : "none" }}>
                            <div>
                                {successMessage}
                            </div>
                        </div>
                        <div className="message" style={{ display: errorMessage ? "block" : "none" }}>
                            <div>
                                {errorMessage}
                            </div>
                        </div>

                        {/* *****Buttons***** */}
                        <div className="container registerButtons">
                            <div className="row justify-content-between">
                                <div className="col-auto">
                                    <Link className="btn btn-primary" type="button" to="/">Volver</Link>
                                </div>
                                <div className="col-auto">
                                    <button className="btn btn-success" type="submit" disabled={!userRegister.name.length || !userRegister.surname.length ||
                                        !userRegister.city.length || !userRegister.email.length || !userRegister.password.length}>Registrarse</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </form >
            </div>
        </div >
    )
};


export default Register;