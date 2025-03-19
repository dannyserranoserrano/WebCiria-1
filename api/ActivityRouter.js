// *****IMPORTAMOS*****
require('dotenv').config();
const express = require("express");
const { Pool } = require('pg'); // Importa el cliente pg
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const { CLIENT_RENEG_LIMIT } = require('tls');

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
        const result = await pool.query(`
            SELECT a.*, 
                   COUNT(DISTINCT e.event_id) as total_events,
                   COUNT(DISTINCT r.user_id) as total_participants
            FROM activities a
            LEFT JOIN events e ON a.activity_id = e.activity_id
            LEFT JOIN reserves r ON e.event_id = r.event_id
            GROUP BY a.activity_id
        `);
        const activities = result.rows;

        if (activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: "La lista de actividades está vacía"
            });
        }

        return res.status(200).json({
            success: true,
            activities
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// *****VISUALIZAR UNA ACTIVIDAD*****
ActivityRouter.get("/findActivity/:activityId", auth, async (req, res) => {
    const { activityId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM activities WHERE activity_id = $1', [activityId]);
        const activity = result.rows[0]; // Obtiene el primer (y único) usuario

        if (!activity) {
            res.status(400).json({
                success: false,
                message: "Activity not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Actividad Encontrada",
            activity
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

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
    const { activityId } = req.params
    const { name, pay } = req.body

    try {
        const activityResult = await pool.query('SELECT * FROM Activities WHERE activity_id = $1', [activityId])
        const activity = activityResult.rows[0]

        if (!activity) {
            return res.status(400).json({ success: false, message: "La actividad no existe" });
        } else {
            const { name, pay } = activity;
            await pool.query(
                'UPDATE activities SET name = $1, pay = $2 WHERE activity_id = $3',
                [name, pay, activityId]
            )

            return res.status(200).json({
                success: true,
                message: ("La Actividad ha sido modificada")
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// ****BORRAMOS ACTIVIDAD*****
ActivityRouter.delete("/deleteActivity/:activityId", auth, authAdmin, async (req, res) => {
    const { activityId } = req.params

    try {
        // Buscamos la actividad
        const activityResult = await pool.query('SELECT * FROM activities WHERE activity_id = $1', [activityId])
        const activity = activityResult.rows[0]

        if (!activity) {
            return res.status(400).json({ success: false, message: "La actividad no existe" })
        } else {
            const { name, pay } = activity;
            await pool.query('DELETE FROM activities WHERE activity_id = $1', [activityId])
            return res.status(200).json({
                success: true,
                message: `La actividad ${name} - ${pay} ha sido borrada`
            })
        };

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: error.message
        })
    }
})

// *****EXPORTAMOS*****
module.exports = ActivityRouter