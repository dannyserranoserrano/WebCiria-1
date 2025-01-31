import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import "./updateFile.css"


const UpdateFile = () => {

    const [updateFile, setUpdateFile] = useState({
        fileName: "",
        description: "",
        date: "",
    });

    const { fileId } = useParams();
    const [file, setFile] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    // *****FUNCION PARA CREAR LA TABLA CON LOS DATOS ANTIGUOS*****
    useEffect(() => {
        const getFile = async () => {
            const response = await axios.get(`/api/findFiles/${fileId}`, {
                withCredentials: true
            })
            console.log(response);
            setFile(response.data.file)
        }
        getFile()
    }, [fileId])


    // *****FUNCION ACTUALIZACION DE DATOS*****
    const handleChange = (e) => {
        setUpdateFile({
            ...updateFile,
            [e.target.name]: e.target.value,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres actualizar los datos del archivo???")
        if (option === true) {

            // *****Hacemos la llamada*****

            const response = await axios.put(
                `/api/updateFile/${fileId}`,
                { ...updateFile }, {
                    withCredentials: true
            })

            try {
                setSuccessMessage(response.data.message)
                console.log(response);

                setTimeout(() => {
                    navigate(`/files/${fileId}`)
                }, 2000)

            } catch (error) {
                setErrorMessage(error.response.data.message)
                setTimeout(() => {
                    window.location.href = `/files/updateFile/${fileId}`
                }, 2000)
            }
        };
    };
    return (
        <div className='updateFile'>
            <div className="header">
                <Header />
            </div>
            <div className="container centerUpdateFile">
                <div className="updateTitleFile text-center mt-3"><p>MODIFICAR DATOS DEL ARCHIVO</p></div>

                {/* *****VISUALIZAMOS ANTES DE MODIFICAR***** */}
                <div className="container tablaUpdateFile w-100 table table-responsive">
                    <div className="headUpdateFile">
                        <div className="reqUpdateFile"><strong>Nombre:</strong> {file.fileName}</div>
                        <div className="reqUpdateFile"><strong>Descripción:</strong> {file.description}</div>
                        <div className="reqUpdateFile"><strong>Fecha del archivo:</strong> {new Date(file.date).toLocaleDateString("es")}</div>
                    </div>
                </div>

                {/* *****FORMULARIO PARA MODIFICAR***** */}
                <form onSubmit={handleSubmit} className="col-auto">
                    <div className="container">
                        <div className='container inputsUpdateFile'>
                            <div className="updateFileName">
                                <label className="form-label">Nombre del Archivo</label>
                                <input type="text" name="fileName" value={updateFile.fileName} className="form-control" id="validationDefault01" onChange={handleChange}
                                    placeholder={file.fileName} required />
                            </div>
                            <div className="updateFileDescription">
                                <label className="form-label">Descripción del Archivo</label>
                                <input type="text" name="description" value={updateFile.description} className="form-control" id="validationDefault01" onChange={handleChange}
                                    placeholder={file.description} required />
                            </div>
                            <div className='updateFileDate'>
                                <label className="form-label">Fecha del Archivo</label>
                                <input type="date" className="form-control" name="date" value={updateFile.date} onChange={handleChange} required />
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
                        <div className="container updateButtonsFile">
                            <div className=" row justify-content-between">
                                <div className='col-auto'>
                                    <Link className="btn btn-primary" type="button" to="/files">Volver</Link>
                                </div>
                                <div className='col-auto'>
                                    <button className="btn btn-warning" type="submit"
                                        disabled={!updateFile.fileName.length || !updateFile.description.length || !updateFile.date.length}
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


export default UpdateFile;