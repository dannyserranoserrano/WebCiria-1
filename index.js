const express = require("express");
const fileUpload = require("express-fileupload")

const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const cors = require("cors")
const path = require("path")

const UserRouter = require("./api/UserRouter")
const FileRouter = require("./api/FileRouter")
const EventRouter = require("./api/EventRouter")
const ActivityRouter = require("./api/activityrouter")
const ReserveRouter = require("./api/ReserveRouter")
const AuthRouter = require("./api/AuthRouter")

const fs = require("fs") //Se usa para tener base de datos e local

// *****SE USA PARA METER DATOS*****
app.use(express.json({
    extended: true
}));
app.use(express.urlencoded({
    extended: true
}));
app.use(fileUpload({
    useTempFiles: true
}))
//*****LLAMAMOS A CORS para evitar bloqueos de seguridad***** */
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://villadeciria.es' : 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())
// *****LLAMAMOS A LOS ENRUTAMIENTOS*****
app.use("/api", UserRouter)
app.use("/api", FileRouter)
app.use("/api", EventRouter)
app.use("/api", ActivityRouter)
app.use("/api", ReserveRouter)
app.use("/api", AuthRouter)

// Eliminamos la conexión a MongoDB ya que ahora usamos PostgreSQL
// La conexión a PostgreSQL se maneja en cada router

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// *****CONEXION CON EL SERVIDOR*****
const PORT = process.env.PORT || 6000
const server = app.listen(PORT, () => {
    console.log(`SERVER CONNECT ON PORT ${PORT}`)
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or stop the process using this port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});