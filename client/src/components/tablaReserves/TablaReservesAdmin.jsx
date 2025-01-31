import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './tablaReserves.css'

const TablaReservesAdmin = () => {
    const [reserves, setReserves] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        getReserves()
    }, [])

    const getReserves = async () => {
        try {
            const response = await axios.get("/api/reserves", {
                withCredentials: true
            })
            if (response.data && response.data.reserves) {
                setReserves(response.data.reserves)
                setError('')
            }
        } catch (error) {
            console.error('Error al obtener las reservas:', error)
            setError('Error al cargar las reservas')
            setReserves([])
        }
    }

    const handleDeleteReserve = async (reserveId) => {
        try {
            await axios.delete(`/api/deleteReserve/${reserveId}`, {
                withCredentials: true
            })
            // Refresh the reserves list after deletion
            getReserves()
        } catch (error) {
            console.error('Error al eliminar la reserva:', error)
            setError('Error al eliminar la reserva')
        }
    }

    return (
        <div className="container tablaReserves col auto mt-4 mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="headReserves table table-responsive mb-0">
                <div className='head2Reserves mt-2'>
                    <div><strong>Evento</strong></div>
                    <div><strong>Participante</strong></div>
                    <div><strong>Acciones</strong></div>
                </div>
                <div>
                    <div className="container">
                        {reserves.map(reserve => (
                            <div key={reserve._id} className="container linkReserves">
                                <div className='link2Reserves m-0'>
                                    <div className='divReserves'>
                                        {reserve.event ? reserve.event.name : 
                                            <span className="text-danger">Evento no disponible</span>}
                                    </div>
                                    <div className='divPartic'>
                                        {reserve.participating.name} {reserve.participating.surname}
                                    </div>
                                    <div className='divActions'>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteReserve(reserve._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TablaReservesAdmin