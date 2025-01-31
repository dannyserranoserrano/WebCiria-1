// *****IMPORTAMOS*****
const express = require("express");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const File = require("../models/File");
const FileRouter = express.Router();

const cloudinary = require("cloudinary");

const fs = require("fs");

// *****INTRODUCIMOS LA CONFIGURACIÓN DE CLOUDINARY PARA SUBIR ARCHIVOS*****
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// *****VISUALIZAR TODOS LOS ARCHIVOS*****
FileRouter.get("/files", async (req, res) => {
  let files = await File.find({});
  return res.status(200).json({
    success: true,
    files,
  });
});

// *****VISUALIZAR UN ARCHIVO*****
FileRouter.get("/findFiles/:fileId", auth, async (req, res) => {
  const { fileId } = req.params;
  try {
    let file = await File.findById(fileId)
      .populate({
        path: "event",
        select: "name dateActivity",
      })
      .populate({
        path: "user",
        select: "name surname",
      });
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Archivo no encontrado",
      });
    }
    return res.status(200).json({
      success: true,
      file,
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
  const { id } = req.user;
  const { fileName, description, date, event } = req.body;
  console.log("Filename server" + fileName);

  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "No has seleccionado ningun archivo",
      });
    }

    if (!fileName || !date) {
      return res.status(400).json({
        success: false,
        message: "No has completado todos los campos",
      });
    }

    const file = req.files.file;
    let newFile;
    try {
      newFile = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "filesUpload",
      });
      await removeTmp(file.tempFilePath);
    } catch (uploadError) {
      await removeTmp(file.tempFilePath);
      throw uploadError;
    }
    let fileImg = await File.create({
      fileName,
      description,
      date,
      image: {
        public_id: newFile.public_id,
        url: newFile.secure_url,
      },
      user: id,
      event,
    });
    return res.status(200).json({
      success: true,
      fileImg,
    });
  } catch (error) {
    console.error("File upload error:", error);
    if (req.files && req.files.file && req.files.file.tempFilePath) {
      removeTmp(req.files.file.tempFilePath);
    }
    res.status(500).json({
      success: false,
      message: "Error al subir el archivo: " + error.message,
    });
  }
});

// ****MODIFICAR DATOS DEL ARCHIVO*****
FileRouter.put("/updateFile/:fileId", auth, async (req, res) => {
  const { fileId } = req.params;
  const { fileName, description, date } = req.body;
  try {
    await File.findByIdAndUpdate(fileId, {
      fileName,
      description,
      date,
    });
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

// ****BORRAMOS DATOS*****
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

    await File.findByIdAndDelete(fileId);
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
    });

    return res.status(200).json({
      success: true,
      message: "Archivo eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//*****Delete temporary files*****
const removeTmp = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        console.error('Error removing temporary file:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// *****EXPORTAMOS*****
module.exports = FileRouter;
