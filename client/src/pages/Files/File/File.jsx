import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import './file.css'
import Header from '../../../components/header/Header'
import axios from "axios";


const File = () => {
    const { fileId } = useParams();
    const [image, setImage] = useState({});
    const [file, setFile] = useState([]);
    const [event, setEvent] = useState({});
    const [user, setUser] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const role = localStorage.getItem("role")
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getFile = async () => {
            try {
                const userResponse = await axios.get('/api/findUser', {
                    withCredentials: true
                });
                setCurrentUserId(userResponse.data.user._id);

                const response = await axios.get(`/api/findFiles/${fileId}`, {
                    withCredentials: true
                });
                console.log(response);

                setImage(response.data.file.image);
                setFile(response.data.file);
                setEvent(response.data.file.event);
                setUser(response.data.file.user);
            } catch (error) {
                console.error('Error fetching file:', error);
                setErrorMessage(error.response?.data?.message || "Error al cargar el archivo");
            }
        };
        getFile()
    }, [fileId])

    // *****FUNCION PARA BORRAR*****
    const deleteFile = async (e) => {
        e.preventDefault();

        // *****Confirmación*****
        let option = window.confirm("Seguro que quieres eliminar el archivo???")
        if (option === true) {

            // *****Hacemos la llamada*****
            const response2 = await axios.delete(
                `/api/deleteFile/${fileId}`, {
                withCredentials: true
            })
            try {
                setSuccessMessage(response2.data.message)
                setTimeout(() => {
                    window.location.href = '/'
                }, 2000)
            } catch (error) {
                setErrorMessage(error.response2.data.message)
                setTimeout(() => {
                    window.location.href = '/file'
                }, 2000)
            }
        };
    };

    return (
        <div className="file">
            <div className="header">
                <Header />
            </div>
            <div className="container centerFile">
                <div className="fileUnloggTitle text-center" style={{ display: !role ? "block" : "none" }}><p>No estás registrado o no estás Logueado</p></div>
                <div className="fileTitle text-center" style={{ display: role ? "block" : "none" }}><p>{file.fileName}</p></div>
                <div className="imgDiv row justify-content-center" style={{ display: role ? "block" : "none" }}>
                    <img className="imgFile" src={image.url} alt={image.fileName} />
                </div>
                <div className="container fileTable w-100 table table-responsive" style={{ display: role ? "block" : "none" }}>
                    <div className="headfile">
                        <div className="reqfile"><strong>Nombre:</strong> {file.fileName}</div>
                        <div className="reqfile"><strong>Descripción:</strong> {file.description}</div>
                        <div className="reqfile"><strong>Fecha</strong> {new Date(file.date).toLocaleDateString("es")}</div>
                        <div className="reqfile"><strong>Evento:</strong> {event?.name || 'Sin evento'}</div>
                        <div className="reqfile"><strong>Usuario:</strong> {user.name} {user.surname}</div>
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
                <div className="container fileButtons mb-3">
                    <div className=" row justify-content-between">
                        <div className="col-auto">
                            <Link className="btn btn-primary" type="button" to="/files">Volver</Link>
                        </div>

                        {(role === 1 || currentUserId === file.user) && (
                            <div className="btn-group col-auto ">
                                <Link className="btn btn-warning" type="button" key={file._id} to={`/files/updateFile/${fileId}`} style={{ display: currentUserId === file.user || role == 1 ? "block" : "none" }}>Modificar</Link>
                                <button className="btn btn-danger" onClick={deleteFile} style={{ display: role == 1 ? "block" : "none" }}>Borrar </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default File;