// *****IMPORTAMOS*****
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); // Importa el cliente pg
const auth = require('../middleware/auth'); // Asume que tienes un middleware de autenticación
const authAdmin = require('../middleware/authAdmin'); // Asume que tienes un middleware de autorización de administrador
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const welcomeEmail = require("../templates/WelcomeEmail")
const modifyEmail = require("../templates/ModifyEmail")
const byeEmail = require("../templates/ByeEmail")

// Configura la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


// *****VISUALIZAMOS TODOS LOS DATOS*****
UserRouter.get("/users", auth, authAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users'); // Ejecuta la consulta SQL
        const users = result.rows; // Obtiene los resultados

        if (users.length === 0) {
            return res.json({
                success: false,
                message: "La lista de usuarios está vacía"
            });
        }

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
});


// // *****VISUALIZAMOS DATOS DE UN SOLO USUARIO*****
UserRouter.get("/findUser/:userId", auth, authAdmin, async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        const user = result.rows[0]; // Obtiene el primer (y único) usuario

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario Encontrado!!!",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// // *****VISUALIZAMOS DATOS PROPIOS*****
UserRouter.get("/findUser", auth, async (req, res) => {
    const { id } = req.user; // Obtiene el id del usuario del token (middleware auth)

    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        const user = result.rows[0]; // Obtiene el primer (y único) usuario

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario Encontrado!!!",
            user
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
});

// // *****CREAMOS NUEVO USUARIO*****
UserRouter.post("/newUser", async (req, res) => {
    const { name, surname, city, email, password } = req.body;

    try {
        const userFindResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const userFind = userFindResult.rows[0];

        // Validaciones
        if (userFind) {
            return res.status(400).json({ success: false, message: "El Usuario ya está registrado" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "El Password debe contener 6 dígitos o más" });
        }
        if (name.length < 3) {
            return res.status(400).json({ success: false, message: "Nombre Inválido" });
        }
        if (surname.length < 2) {
            return res.status(400).json({ success: false, message: "Apellido Inválido" });
        }
        if (!name || !surname || !city || !email || !password) {
            return res.status(400).json({ success: false, message: "Debes completar todos los campos" });
        }
        const re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (!re.exec(email)) {
            return res.status(400).json({ success: false, message: "El formato de Email no es correcto" });
        }

        // Encriptación de la contraseña
        const passwordHash = bcrypt.hashSync(password, 10);

        // Envío de correo de verificación (adapta esto a tu lógica)
        welcomeEmail.sendWelcomeEmail(name, surname, city, email, password);

        // Inserción del usuario en PostgreSQL
        const result = await pool.query(
            'INSERT INTO users (name, surname, city, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, surname, city, email, passwordHash]
        );
        //const newUser = result.rows[0];

        return res.json({
            success: true,
            status: 200,
            message: `El usuario ${name} ${surname} está añadido`,
            //user: newUser,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

// // ****MODIFICAR DATOS DE UN USUARIO*****
UserRouter.put("/updateUser/:userId", auth, authAdmin, async (req, res) => {
    const { userId } = req.params;
    const { city, role } = req.body;

    try {
        // Obtener el usuario actual
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const { name, surname, email, password } = user;

        // Encriptar la contraseña (si es necesario)
        const passwordHash = bcrypt.hashSync(password, 10);

        // Enviar correo de modificación (adapta esto a tu lógica)
        modifyEmail.sendModifyEmail(name, surname, city, email, password);

        // Actualizar el usuario en PostgreSQL
        await pool.query(
            'UPDATE users SET city = $1, password = $2, role = $3 WHERE user_id = $4',
            [city, passwordHash, role, userId]
        );

        return res.status(200).json({
            success: true,
            message: `Los Datos del usuario ${name} ${surname} han sido modificados`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// // ****MODIFICAR NUESTROS DATOS*****
UserRouter.put("/updateUser", auth, async (req, res) => {
    const { id } = req.user; // Obtiene el id del usuario del token
    const { city, password } = req.body;

    try {
        // Obtener el usuario actual
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const { name, surname, email } = user;

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "El Password debe contener 6 dígitos o más" });
        }

        // Encriptar la contraseña
        const passwordHash = bcrypt.hashSync(password, 10);

        // Enviar correo de modificación (adapta esto a tu lógica)
        modifyEmail.sendModifyEmail(name, surname, city, email, password);

        // Actualizar el usuario en PostgreSQL
        await pool.query(
            'UPDATE users SET city = $1, password = $2 WHERE user_id = $3',
            [city, passwordHash, id]
        );

        return res.status(200).json({
            success: true,
            message: `Los Datos del usuario ${name} ${surname} han sido modificados`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// // ****BORRAMOS DATOS DE UN USUARIO*****

UserRouter.delete("/deleteUser/:userId", auth, async (req, res) => {
    const { userId } = req.params;

    try {
        // Obtener el usuario antes de eliminarlo
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const { name, surname, city, email } = user;

        // Enviar correo de despedida (adapta esto a tu lógica)
        byeEmail.sendByeEmail(name, surname, city, email);

        // Eliminar reservas del usuario (participating)
        await pool.query('DELETE FROM reserves WHERE user_id = $1', [userId]);

        // Eliminar eventos creados por el usuario (userCreate)
        await pool.query('DELETE FROM events WHERE user_create_id = $1', [userId]);

        // Eliminar el usuario
        await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);

        // Eliminar el usuario de la tabla de participantes de eventos.
        await pool.query('DELETE FROM event_participants WHERE user_id = $1', [userId]);

        return res.status(200).json({
            success: true,
            message: "El Usuario ha sido borrado",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// // ****BORRAMOS NUESTRO USUARIO*****

UserRouter.delete("/deleteUser", auth, async (req, res) => {
    const { id } = req.user; // Obtiene el id del usuario del token

    try {
        // Obtener el usuario antes de eliminarlo
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const { name, surname, city, email } = user;

        // Enviar correo de despedida (adapta esto a tu lógica)
        byeEmail.sendByeEmail(name, surname, city, email);

        // Eliminar reservas del usuario (participating)
        await pool.query('DELETE FROM reserves WHERE user_id = $1', [id]);

        // Eliminar eventos creados por el usuario (userCreate)
        await pool.query('DELETE FROM events WHERE user_create_id = $1', [id]);

        // Eliminar el usuario
        await pool.query('DELETE FROM users WHERE user_id = $1', [id]);

        // Eliminar el usuario de la tabla de participantes de eventos.
        await pool.query('DELETE FROM event_participants WHERE user_id = $1', [id]);

        //Actualizar eventos donde el usuario era el creador, asignar un usuario por defecto.
        await pool.query('UPDATE events SET user_create_id = (SELECT user_id FROM users WHERE email = \'usuario_no_existente@example.com\') WHERE user_create_id = $1',[id]);

        return res.status(200).json({
            success: true,
            message: "El Usuario ha sido borrado",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// // *****FUNCION PARA LOGUEARSE*****
UserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        const re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "No has completado todos los campos" });
        }
        if (!user) {
            return res.status(400).json({ success: false, message: "El Usuario no está registrado" });
        }
        if (!re.exec(email)) {
            return res.status(400).json({ success: false, message: "El formato del Email no es correcto" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "El Password debe contener 6 dígitos o más" });
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
            return res.status(400).json({ success: false, message: "Password Incorrecto" });
        }

        const { name, role, user_id } = user;
        const token = accessToken({ id: user_id }); // Usa user_id en lugar de user._id

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 12 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            success: true,
            message: "Usuario Logueado correctamente",
            role,
            name,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

const accessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "12h"
    })
}

// *****EXPORTAMOS*****
module.exports = UserRouter