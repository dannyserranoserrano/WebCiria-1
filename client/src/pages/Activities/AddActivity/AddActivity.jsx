import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import "./addActivity.css"


const AddActivity = () => {

    const [addActivity, setAddActivity] = useState({
        name: "",
        pay: "",
    });


    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setAddActivity({
            ...addActivity,
            [e.target.name]: e.target.value,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                '/api/newActivity',  // This will be proxied to your backend
                addActivity,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccessMessage(response.data.message);

            setTimeout(() => {
                navigate('/activities');
            }, 2000);

        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al crear la actividad');
        }
    };

    return (
        <div className='addActivity'>
            <div className="header">
                <Header />
            </div>
            <div className="container centerAddActivity">
                <div className="addTitle text-center mt-3"><p>AÑADIR ACTIVIDAD</p></div>
                <form onSubmit={handleSubmit} className="col-auto">
                    <div className="container">
                        <div className='container inputsAddActivity'>
                            <div className="addName">
                                <label className="form-label">Nombre de la Actividad</label>
                                <input type="text" name="name" value={addActivity.name} className="form-control" id="validationDefault01" onChange={handleChange}
                                    placeholder="Nombre de la actividad" required />
                            </div>
                            <div className='addPay'>
                                <label className="form-label">De pago</label>
                                <select 
                                    className="form-select" 
                                    name="pay" 
                                    value={addActivity.pay} 
                                    onChange={handleChange} 
                                    aria-label="Default select example"
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="Pago">Pago</option>
                                    <option value="Gratis">Gratis</option>
                                </select>
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
                        <div className="container Addbuttons">
                            <div className=" row justify-content-between">
                                <div className='col-auto'>
                                    <Link className="btn btn-primary" type="button" to="/activities">Volver</Link>
                                </div>
                                <div className='col-auto'>
                                    <button className="btn btn-success" type="submit"
                                        disabled={!addActivity.name.length || !addActivity.pay.length}
                                    >Añadir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form >
            </div>
        </div >
    )
};


export default AddActivity;