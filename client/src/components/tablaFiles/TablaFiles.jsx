import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './tablaFiles.css'
import { Link } from 'react-router-dom'


const TablaFiles = () => {

    const [files, setFiles] = useState([])

    useEffect(() => {
        const getFiles = async () => {
            const response = await axios.get("/api/files", {
                withCredentials: true
            })
            console.log(response);
            setFiles(response.data.files);
        }
        getFiles();
    }, []);

    return (
        <div className=" row justify-content-around">
            <div id="carouselExampleFade" className="col-auto carrusel carousel slide carousel-fade w-100" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active ">
                        <div className="carousel-image-container">
                            <img src="./images/DSC_0477.JPG" className="d-block w-100 imagen" alt="Principal" />
                        </div>
                    </div>
                    {files.map(e => (
                        <Link key={e._id} to={`/files/${e._id}`} className="carousel-item ">
                            <div className="carousel-image-container">
                                <img
                                    src={e.image.url}
                                    className="d-block w-100 imagen"
                                    alt={e?.fileName || 'Imagen'}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}


export default TablaFiles;