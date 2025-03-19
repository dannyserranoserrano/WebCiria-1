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
        const result = await pool.query(`
            SELECT e.*, 
                   a.name as activity_name,
                   u.name as creator_name,
                   COUNT(r.reserve_id) as total_reserves
            FROM events e
            LEFT JOIN activities a ON e.activity_id = a.activity_id
            LEFT JOIN users u ON e.user_create = u.user_id
            LEFT JOIN reserves r ON e.event_id = r.event_id
            GROUP BY e.event_id, a.name, u.name
            ORDER BY e.date_activity DESC
        `);
        const events = result.rows;

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        return res.status(500).json({
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
            return res.status(400).json({
                success: false,
                message: "Evento no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
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
            return res.json({
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
    const { activityId, name, description, price, dateActivity } = req.body

    try {
        // *****Condición de si no eres el creador no puedes modificar*****
        const userCreateId = await pool.query('SELECT * FROM events WHERE event_Id= $1', [eventId]);

        if (!userCreateId) {
            return res.status(404).json({ success: false, message: "Evento no encontrado" })
        } else if (userCreateId.user_create_id != id) {
            res.status(400).json({ success: false, message: "No puedes modificar el evento porque no eres el creador" })
        } else {
            await pool.query(
                'UPDATE Events SET activity_id = $1, name = $2, description = $3, price = $4, date_activity = $5 WHERE event_id = $6',
                [activityId, name, description, price, dateActivity, eventId]
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
            const name = event.name

            // *****Borramos el evento*****
            await pool.query('DELETE FROM events WHERE event_id = $1', [eventId]);

            // *****Borramos el evento de File*****
            const filesResults = await pool.query('SELECT * FROM files WHERE event_id = $1', [eventId]);
            const files = filesResults.rows;

            if (files.length > 0) {
                // Actualizamos todos los archivos asociados en una sola consulta
                await pool.query(
                    'UPDATE files SET event_id = $1 WHERE event_id = $2',
                    ["nulo", eventId]
                );
            }

            // *****Borramos las reservas de ese evento*****
            await pool.query('DELETE FROM reserves WHERE event_id = $1', [eventId]);

            return res.json({
                success: true,
                message: "El Evento ha sido borrado"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// *****EXPORTAMOS*****
module.exports = EventRouter