// *****IMPORTAMOS*****
require('dotenv').config();
const express = require("express");
const { Pool } = require('pg'); // Importa el cliente pg
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const ActivityRouter = express.Router();

// Configura la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// *****VISUALIZAMOS LAS ACTIVIDADES*****
ActivityRouter.get("/activities", auth, async (req, res) => {
    try {
        console.log('Obteniendo actividades...');
        const result = await pool.query(`SELECT * FROM activities`);
        const activities = result.rows;
        console.log(`Se encontraron ${activities.length} actividades`);
        console.log(activities);

        if (activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: "La lista de actividades está vacía"
            });
        }

        return res.status(200).json({
            success: true,
            count: activities.length,
            activities
        });
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// *****VISUALIZAR UNA ACTIVIDAD*****
ActivityRouter.get("/findActivity/:activityId", auth, async (req, res) => {
    const { activityId } = req.params;
    console.log(activityId);
    try {
        const result = await pool.query('SELECT * FROM activities WHERE activity_id = $1', [activityId]);
        const activity = result.rows[0];

        if (!activity) {
            return res.status(400).json({
                success: false,
                message: "Actividad no encontrada"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Actividad Encontrada",
            activity
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// *****CREAMOS NUEVA ACTIVIDAD*****
ActivityRouter.post("/newActivity", auth, authAdmin, async (req, res) => {
    const { name, pay } = req.body;

    try {
        // Validate input
        if (!name || !pay) {
            return res.status(400).json({
                success: false,
                message: "No has rellenado todos los campos"
            });
        }

        // Check if activity exists
        const activityFindResult = await pool.query('SELECT * FROM activities WHERE name = $1', [name]);
        console.log(activityFindResult);
        const activityFind = activityFindResult.rows[0];

        if (activityFind) {
            return res.status(400).json({ success: false, message: "La actividad ya está registrada" });
        } else {
            // Insert new activity
            const result = await pool.query(
                'INSERT INTO activities (name, pay) VALUES ($1, $2) RETURNING *',
                [name, pay]
            );
            const newActivity = result.rows[0];

            return res.status(200).json({
                success: true,
                message: `Actividad ${name} - ${pay} creada correctamente`,
                activity: newActivity
            });
        }
    } catch (error) {
        console.error('Error creating activity:', error);
        return res.status(400).json({ success: false, message: error.message });
    }
});

// ****MODIFICAR DATOS DE LA ACTIVIDAD****
ActivityRouter.put("/updateActivity/:activityId", auth, authAdmin, async (req, res) => {
    const { activityId } = req.params;
    const { name, pay } = req.body;

    try {
        const activityResult = await pool.query('SELECT * FROM Activities WHERE activity_id = $1', [activityId]);
        const activity = activityResult.rows[0];

        if (!activity) {
            return res.status(400).json({ success: false, message: "La actividad no existe" });
        }

        // Fix: Use the values from req.body instead of activity
        await pool.query(
            'UPDATE activities SET name = $1, pay = $2 WHERE activity_id = $3',
            [name, pay, activityId]
        );

        return res.status(200).json({
            success: true,
            message: "La Actividad ha sido modificada"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ****BORRAMOS ACTIVIDAD*****
ActivityRouter.delete("/deleteActivity/:activityId", auth, authAdmin, async (req, res) => {
    const { activityId } = req.params;

    try {
        // First check if the activity exists
        const activityResult = await pool.query('SELECT * FROM activities WHERE activity_id = $1', [activityId]);
        const activity = activityResult.rows[0];

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Actividad no encontrada"
            });
        }

        // Start transaction
        await pool.query('BEGIN');

        try {
            // First, delete all reserves for this activity's events
            await pool.query(`
                DELETE FROM reserves 
                WHERE event_id IN (
                    SELECT event_id 
                    FROM events 
                    WHERE activity_id = $1
                )
            `, [activityId]);

            // Then delete all events
            await pool.query('DELETE FROM events WHERE activity_id = $1', [activityId]);

            // Finally delete the activity
            await pool.query('DELETE FROM activities WHERE activity_id = $1', [activityId]);

            await pool.query('COMMIT');

            return res.status(200).json({
                success: true,
                message: `La actividad ${activity.name} ha sido eliminada junto con todos sus eventos y reservas asociados`
            });

        } catch (innerError) {
            await pool.query('ROLLBACK');
            throw innerError;
        }

    } catch (error) {
        console.error('Error en la eliminación:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la actividad: " + error.message
        });
    }
});

// *****EXPORTAMOS*****
module.exports = ActivityRouter