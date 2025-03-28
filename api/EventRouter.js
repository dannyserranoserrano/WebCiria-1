// *****IMPORTAMOS*****
require('dotenv').config();
const express = require("express");
const { Pool } = require('pg'); // Importa el cliente pg
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const EventRouter = express.Router();

// Configura la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// *****VISUALIZAMOS TODOS LOS EVENTOS*****
EventRouter.get("/events", async (req, res) => {
    try {
        // Añadimos logs para depuración
        console.log('Obteniendo eventos...');
        const result = await pool.query(`SELECT * FROM events`);
        const events = result.rows;
        console.log(`Se encontraron ${events.length} eventos`);
        console.log(events);

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// *****VISUALIZAR UN EVENTO*****
EventRouter.get("/findEvent/:eventId", async (req, res) => {
    const { eventId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM events WHERE event_id = $1', [eventId]); // Ejecuta la consulta SQL
        const event = result.rows[0]; // Obtiene el primer (y único) evento

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Evento no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Evento encontrado",
            event
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// *****CREAMOS NUEVOS EVENTOS*****
EventRouter.post("/newEvent", auth, async (req, res) => {

    const { id } = req.user // Nos reconoce el usuario mediante el Tokken (auth.js)
    const { activityId, name, description, price, dateActivity, } = req.body

    try {
        // *****COMPROBAMOS ERRORES*****
        if (!activityId || !description || !price || !dateActivity) {
            return res.status(400).json({
                success: false,
                message: "No has completado todos los campos"
            })
        } else {
            // Iniciamos una transacción para asegurar que ambas operaciones se completen o ninguna
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // Insertamos el evento
                const eventResult = await client.query(
                    'INSERT INTO events (activity_id, name, description, price, user_create_id, date_activity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [activityId, name, description, price, id, dateActivity]
                );
                const newEvent = eventResult.rows[0];

                // Insertamos la relación en reserves
                await client.query(
                    'INSERT INTO reserves (event_id, user_id) VALUES ($1, $2)',
                    [newEvent.event_id, id]
                );

                await client.query('COMMIT');

                return res.status(200).json({
                    success: true,
                    message: `Evento ${name} creado correctamente`,
                    event: newEvent
                });
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        }

    } catch (error) {
        console.error('Error al crear evento:', error);
        return res.status(400).json({ success: false, message: error.message })
    }
});

// ****MODIFICAR DATOS DEL EVENTO****
EventRouter.put("/updateEvent/:eventId", auth, async (req, res) => {
    const { id } = req.user // Nos reconoce el usuario mediante el Tokken (auth.js)
    const { eventId } = req.params
    const { activity_id, name, description, price, date_activity } = req.body

    try {
        // *****Condición de si no eres el creador no puedes modificar*****
        const response = await pool.query('SELECT * FROM events WHERE event_id= $1', [eventId]);
        const eventData = response.rows[0];

        if (!eventData) {
            return res.status(404).json({ success: false, message: "Evento no encontrado" })
        } else if (eventData.user_create_id != id) {
            res.status(500).json({ success: false, message: "No puedes modificar el evento porque no eres el creador" })
        } else {
            await pool.query(
                'UPDATE Events SET activity_id = $1, name = $2, description = $3, price = $4, date_activity = $5 WHERE event_id = $6',
                [activity_id, name, description, price, date_activity, eventId]
            );
            return res.status(200).json({
                success: true,
                message: (`El Evento ${name} ha sido modificado`)
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})


// ****BORRAMOS EVENTO*****
EventRouter.delete("/deleteEvent/:eventId", auth, authAdmin, async (req, res) => {
    const { eventId } = req.params

    try {
        const result = await pool.query('SELECT * FROM events WHERE event_id = $1', [eventId]);
        const event = result.rows[0];

        if (!event) {
            return res.status(404).json({ success: false, message: "Evento no encontrado" });
        } else {
            // Start a transaction
            await pool.query('BEGIN');
            
            try {
                // *****Primero borramos las reservas de ese evento*****
                await pool.query('DELETE FROM reserves WHERE event_id = $1', [eventId]);
                
                // *****Actualizamos los archivos asociados*****
                await pool.query(
                    'UPDATE files SET event_id = NULL WHERE event_id = $1',
                    [eventId]
                );
                
                // *****Finalmente borramos el evento*****
                await pool.query('DELETE FROM events WHERE event_id = $1', [eventId]);
                
                // Commit the transaction
                await pool.query('COMMIT');

                return res.json({
                    success: true,
                    message: "El Evento ha sido borrado junto con todas sus reservas"
                });
            } catch (error) {
                // Rollback in case of error
                await pool.query('ROLLBACK');
                throw error;
            }
        }
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// *****EXPORTAMOS*****
module.exports = EventRouter