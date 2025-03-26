// *****IMPORTAMOS*****
const express = require("express");
const { Pool } = require('pg'); // Importa el cliente pg
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const ReserveRouter = express.Router();

// Configura la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// *****VISUALIZAMOS TODAS LAS RESERVAS (admin)*****
ReserveRouter.get("/reserves", auth, authAdmin, async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT 
        r.reserve_id,
        r.event_id,
        r.participating,
        r.created_at,
        e.name as event_name, 
        e.date_activity,
        u.name as user_name, 
        u.surname as user_surname
      FROM reserves r
      LEFT JOIN events e ON r.event_id = e.event_id
      LEFT JOIN users u ON r.participating = u.user_id
      ORDER BY e.date_activity DESC
    `);
    const reserves = results.rows;

    if (reserves.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hay reservas solicitadas"
      });
    }

    return res.status(200).json({
      success: true,
      count: reserves.length,
      reserves
    });
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las reservas",
      error: error.message
    });
  }
});

// *****VISUALIZAMOS TODAS MIS RESERVAS (user)*****
ReserveRouter.get("/myReserves", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const results = await pool.query(`
      SELECT r.*, 
             e.name as event_name, e.date_activity,
             u.name as user_name, u.surname as user_surname
      FROM reserves r
      LEFT JOIN events e ON r.event_id = e.event_id
      LEFT JOIN users u ON r.participating = u.user_id
      WHERE r.participating = $1
      ORDER BY e.date_activity DESC
    `, [id]);
    const reserves = results.rows;

    if (reserves.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tienes reservas activas"
      });
    }

    return res.status(200).json({
      success: true,
      reserves
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// *****CREAMOS UNA RESERVA PARA EL EVENTO*****
ReserveRouter.post("/newReserve/:eventId", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.user;
    const { eventId } = req.params;

    await client.query('BEGIN');

    // Verificar si el evento existe
    const eventResult = await client.query('SELECT * FROM events WHERE event_id = $1', [eventId]);
    const event = eventResult.rows[0];

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Este evento no existe"
      });
    }

    // Verificar si ya existe la reserva
    const existingReserve = await client.query(
      'SELECT * FROM reserves WHERE event_id = $1 AND user_id = $2',
      [eventId, id]
    );

    if (existingReserve.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya estás registrado en este evento"
      });
    }

    // Crear nueva reserva
    const newReserve = await client.query(
      'INSERT INTO reserves (event_id, user_id) VALUES ($1, $2) RETURNING *',
      [eventId, id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: "Te has registrado como participante de este evento",
      reserve: newReserve.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    client.release();
  }
});

// *****VISUALIZAR RESERVAS DE UN EVENTO*****
ReserveRouter.get("/findReserve/:eventId", async (req, res) => {
    const { eventId } = req.params;
    try {
        const results = await pool.query(`
            SELECT 
                r.*,
                u.name,
                u.surname,
                u.user_id
            FROM reserves r
            LEFT JOIN users u ON r.user_id = u.user_id
            WHERE r.event_id = $1
        `, [eventId]);
        
        const reserves = results.rows;

        if (reserves.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hay reservas solicitadas para este evento"
            })
        }

        return res.status(200).json({
            success: true,
            reserves
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ****BORRAMOS RESERVA*****
ReserveRouter.delete("/deleteReserve/:reserveId", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { reserveId } = req.params;
    const { id } = req.user;

    await client.query('BEGIN');

    // Verificar si existe la reserva y pertenece al usuario
    const reserveResult = await client.query(
      'SELECT * FROM reserves WHERE reserve_id = $1 AND participating = $2',
      [reserveId, id]
    );

    if (reserveResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada o no tienes permiso para eliminarla"
      });
    }

    // Eliminar la reserva
    await client.query('DELETE FROM reserves WHERE reserve_id = $1', [reserveId]);

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: "La reserva ha sido eliminada"
    });

  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    client.release();
  }
});

// *****EXPORTAMOS*****
module.exports = ReserveRouter;
