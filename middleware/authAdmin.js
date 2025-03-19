const jwt = require("jsonwebtoken");
const { Pool } = require('pg'); // Importamos Pool de pg

// Configuramos la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const authAdmin = async (req, res, next) => {
    try {
        // Obtenemos el ID del usuario desde req.user
        const { id } = req.user;
        
        // Consultamos el usuario en PostgreSQL
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        const user = userResult.rows[0];
        
        // Verificamos si el usuario existe
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        
        // Verificamos si el usuario es administrador
        if (user.role === 0) {
            return res.status(400).json({
                success: false,
                message: "No tienes permisos de administrador"
            });
        }

        next();

    } catch (error) {
        console.error('Error en authAdmin middleware:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = authAdmin;