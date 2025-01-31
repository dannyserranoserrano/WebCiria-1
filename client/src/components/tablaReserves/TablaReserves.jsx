import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './tablaReserves.css'

const TablaReserves = () => {
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
            if (response.data && response.data.success && response.data.reserves) {
                setReserves(response.data.reserves)
                setError('')
            } else {
                setError('No hay reservas disponibles')
                setReserves([])
            }
        } catch (error) {
            console.error('Error al obtener las reservas:', error)
            setError('Error al cargar las reservas')
            setReserves([])
        }
    }

    const handleDeleteReserve = async (reserveId) => {
        try {
            const response = await axios.delete(`/api/deleteReserve/${reserveId}`, {
                withCredentials: true
            })
            if (response.data && response.data.success) {
                getReserves()
            } else {
                setError('Error al eliminar la reserva')
            }
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
                                        {reserve.participating ? 
                                            `${reserve.participating.name || ''} ${reserve.participating.surname || ''}` :
                                            <span className="text-danger">Participante no disponible</span>
                                        }
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

export default TablaReserves;