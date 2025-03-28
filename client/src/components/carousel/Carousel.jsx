import React, { useEffect, useState } from 'react'
// import { Link } from "react-router-dom"
import axios from 'axios'
import './carousel.css'


const Carousel = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFiles = async () => {
            try {
                const response = await axios.get("/api/files", {
                    withCredentials: true
                });
                setFiles(response.data.files || []);
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('Error al cargar las imágenes');
                setFiles([]);
            }
        }
        getFiles();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="row justify-content-around">
            <div id="carouselExampleFade" className="col-auto carrusel carousel slide carousel-fade w-100" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="carousel-image-container">
                            <img src="./images/DSC_0477.JPG" className="imagen d-block w-100" alt="Principal" 
                                 onError={(e) => {e.target.src = './images/fallback-image.jpg'}} />
                        </div>
                    </div>
                    {Array.isArray(files) && files.map(file => (
                        <div key={file.file_id} className="carousel-item">
                            <div className="carousel-image-container">
                                <img 
                                    src={file.url || './images/fallback-image.jpg'} 
                                    className="d-block w-100" 
                                    alt={file.filename || 'Image'} 
                                    onError={(e) => {e.target.src = './images/fallback-image.jpg'}}
                                />
                            </div>
                        </div>
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

export default Carousel;