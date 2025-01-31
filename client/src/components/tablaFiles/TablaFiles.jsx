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
        <div className='container'>
            <div className=" row justify-content-around">
                <div id="carouselExampleFade" className="tablaFiles col-auto carousel slide carousel-fade w-100" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active ">
                            <img src="./images/DSC_0477.JPG" className="d-block w-100 imagen" alt="Principal" />
                        </div>
                        {files.map(e => (
                            <Link key={e._id} to={`/files/${e._id}`} className="carousel-item ">
                                <img src={e.image.url} className="d-block w-100 imagen" alt={e.fileName} />
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
        </div>
    )
}


export default TablaFiles;