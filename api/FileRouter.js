// *****IMPORTAMOS*****
const express = require("express");
const { Pool } = require('pg'); // Importa el cliente pg
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const FileRouter = express.Router();

const cloudinary = require("cloudinary");
const fs = require("fs");

// Configura la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// *****INTRODUCIMOS LA CONFIGURACIÓN DE CLOUDINARY PARA SUBIR ARCHIVOS*****
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// *****VISUALIZAR TODOS LOS ARCHIVOS*****
FileRouter.get("/files", async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT f.*, e.name as event_name, u.name as user_name 
      FROM files f 
      LEFT JOIN events e ON f.event_id = e.event_id 
      LEFT JOIN users u ON f.user_id = u.user_id
    `);
    const files = results.rows;

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hay archivos disponibles"
      });
    }

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

});

// *****VISUALIZAR UN ARCHIVO*****
FileRouter.get("/findFiles/:fileId", auth, async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT f.*, e.name as event_name, u.name as user_name 
      FROM files f 
      LEFT JOIN events e ON f.event_id = e.event_id 
      LEFT JOIN users u ON f.user_id = u.user_id 
      WHERE f.file_id = $1
    `, [fileId]);
    const file = results.rows[0];

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
    }
    return res.status(200).json({
      success: true,
      file
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// *****CREAMOS NUEVO ARCHIVO*****
FileRouter.post("/newFile", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const { fileName, description, date, event } = req.body;

    // Validaciones mejoradas
    if (!req.files?.file) {
      return res.status(400).json({
        success: false,
        message: "No has seleccionado ningún archivo"
      });
    }

    if (!fileName || !date || !event) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: nombre, fecha o evento"
      });
    }

    const fileUpload = req.files.file;
    let newImage;

    // Subir a Cloudinary
    try {
      newImage = await cloudinary.v2.uploader.upload(fileUpload.tempFilePath, {
        folder: "filesUpload"
      });
    } catch (uploadError) {
      throw new Error(`Error al subir a Cloudinary: ${uploadError.message}`);
    } finally {
      await removeTmp(fileUpload.tempFilePath);
    }

    // Insertar en base de datos
    const fileImg = await pool.query(
      "INSERT INTO files (file_name, description, date, image, user_id, event_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        fileName,
        description || null,
        date,
        JSON.stringify({ public_id: newImage.public_id, url: newImage.secure_url }),
        id,
        event
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Archivo subido correctamente",
      file: fileImg.rows[0]
    });

  } catch (error) {
    // Limpiar Cloudinary si existe la imagen
    if (newImage?.public_id) {
      await cloudinary.v2.uploader.destroy(newImage.public_id)
        .catch(err => console.error("Error al eliminar imagen de Cloudinary:", err));
    }

    console.error("Error en el proceso de subida:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ****MODIFICAR DATOS DEL ARCHIVO*****
FileRouter.put("/updateFile/:fileId", auth, async (req, res) => {
  const { fileId } = req.params;
  const { fileName, description, date } = req.body;
  try {

    const result = await pool.query("SELECT * FROM files WHERE file_id = $1", [fileId]);
    const fileSelect = result.rows[0];

    if (!fileSelect) {
      return res.status(400).json({
        success: false,
        message: "Archivo no encontrado",
      });
    }

    await pool.query(
      "UPDATE files SET file_name = $1, description = $2, date = $3 WHERE file_id = $4",
      [fileName, description, date, fileId]
    );
    return res.status(200).json({
      success: true,
      message: "Los datos del archivo han sido modificados",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ****BORRAMOS Imagen*****
FileRouter.delete("/deleteFile/:fileId", auth, authAdmin, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "No se han seleccionado imagenes",
      });
    }

    const result = await pool.query("SELECT * FROM files WHERE file_id = $1", [fileId]);
    if (!result.rows[0]) {
      return res.status(400).json({
        success: false,
        message: "Archivo no encontrado",
      });
    } else {
      await pool.query("DELETE FROM files WHERE file_id = $1", [fileId]);
      cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;
      });

      return res.status(200).json({
        success: true,
        message: "Archivo eliminado correctamente",
      });
    }


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//*****Delete temporary files*****
const removeTmp = async (path) => {
  try {
    if (fs.existsSync(path)) {
      await fs.promises.unlink(path);
      console.log('Temporary file removed successfully');
    }
  } catch (error) {
    console.error('Error removing temporary file:', error);
    // Don't throw the error, just log it
    // We don't want temporary file errors to break the main flow
  }
};

// *****EXPORTAMOS*****
module.exports = FileRouter;
