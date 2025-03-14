// *****IMPORTAMOS*****
const express = require("express");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const User = require("../models/User");
const Reserve = require("../models/Reserve")
const Event = require("../models/Event")
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const welcomeEmail = require("../templates/WelcomeEmail")
const modifyEmail = require("../templates/ModifyEmail")
const byeEmail = require("../templates/ByeEmail")

// *****VISUALIZAMOS TODOS LOS DATOS*****
UserRouter.get("/users", auth, authAdmin, async (req, res) => {
    try {
        let users = await User.find({})
        if (!users) {
            res.json({
                success: false,
                message: "La lista de usuarios está vacía"
            })
        }

        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
})


// *****VISUALIZAMOS DATOS DE UN SOLO USUARIO*****
UserRouter.get("/findUser/:userId", auth, authAdmin, async (req, res) => {
    const {
        userId
    } = req.params
    try {
        let user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Usuario Encontrado!!!",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// *****VISUALIZAMOS DATOS PROPIOS*****
UserRouter.get("/findUser", auth, async (req, res) => {

    const {
        id
    } = req.user // Nos reconoce el usuario mediante el Tokken (auth.js)
    try {
        let user = await User.findById(id)
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Usuario Encontrado!!!",
            user
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
})

// *****CREAMOS NUEVO USUARIO*****
UserRouter.post("/newUser", async (req, res) => {
    const {
        name,
        surname,
        city,
        email,
        password
    } = req.body
    try {
        let userFind = await User.findOne({
            email
        })

        // *****CREAMOS ERRORES*****
        if (userFind) {
            return res.status(400).json({
                success: false,
                message: "El Usuario ya está registrado"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "El Password debe contener 6 dígitos o más"
            })
        }

        if (name.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Nombre Inválido"
            })
        }

        if (surname.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Apellido Inválido"
            })
        }

        if (!name || !surname || !city || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Debes completar todos los campos"
            })
        }

        re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if (!re.exec(email)) {
            return res.status(400).json({
                success: false,
                message: "El formato de Email no es correcto"
            })
        }

        // *****Aqui le damos la encriptación a la contraseña*****
        let passwordHash = bcrypt.hashSync(password, 10)

        // *****MANDA EL CORREO DE VERIFICACIÓN*****
        welcomeEmail.sendWelcomeEmail(
            name,
            surname,
            city,
            email,
            password
            // se llama la función despues de hashear la contraseña y antes de crear el usuario
        )

        let user = new User({
            name,
            surname,
            city,
            email,
            password: passwordHash
        })

        // *****Confirmación guardado*****

        await user.save();

        return res.json({
            success: true,
            status: (200),
            message: (`El usuario ${name} ${surname} está añadido`),
            user
        });



    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

// ****MODIFICAR DATOS DE UN USUARIO*****
UserRouter.put("/updateUser/:userId", auth, authAdmin, async (req, res) => {

    const {
        userId
    } = req.params

    const {
        city,
        role
    } = req.body

    try {

        const user = await User.findById(userId)
        const name = user.name
        const surname = user.surname
        const email = user.email
        const password = user.password

        let passwordHash = bcrypt.hashSync(password, 10)

        // *****MANDA EL CORREO DE VERIFICACIÓN*****

        modifyEmail.sendModifyEmail(
            name,
            surname,
            city,
            email,
            password
        )

        await User.findByIdAndUpdate(userId, {
            city,
            password: passwordHash,
            role
        })
        return res.status(200).json({
            success: true,
            message: (`Los Datos del usuario ${name} ${surname} han sido modificados`)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// ****MODIFICAR NUESTROS DATOS*****
UserRouter.put("/updateUser", auth, async (req, res) => {

    const {
        id
    } = req.user // Nos reconoce el usuario mediante el Tokken (auth.js)

    const {
        city,
        password,

    } = req.body

    try {

        const user = await User.findById(id)
        const name = user.name
        const surname = user.surname
        const email = user.email


        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "El Password debe contener 6 dígitos o más"
            })
        }

        let passwordHash = bcrypt.hashSync(password, 10)

        // *****MANDA EL CORREO DE VERIFICACIÓN*****
        modifyEmail.sendModifyEmail(
            name,
            surname,
            city,
            email,
            password,
        )

        await User.findByIdAndUpdate(id, {
            name,
            surname,
            city,
            password: passwordHash,
        })
        return res.status(200).json({
            success: true,
            message: (`Los Datos del usuario ${name} ${surname} han sido modificados`)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// ****BORRAMOS DATOS DE UN USUARIO*****

UserRouter.delete("/deleteUser/:userId", auth, async (req, res) => {

    const {
        userId
    } = req.params // Nos reconoce el usuario mediante el Tokken (auth.js)

    try {

        // // *****MANDA EL CORREO DE VERIFICACIÓN*****
        const user = await User.findById(userId)
        const name = user.name
        const surname = user.surname
        const city = user.city
        const email = user.email
        byeEmail.sendByeEmail(
            name,
            surname,
            city,
            email,
        )

        // *****Funciones para borrar el usuario y todas sus reservas*****
        await User.findByIdAndDelete(userId)

        // *****Borramos las reservas del usuario(Participantes)*****
        let reserveList = []
        Reserve.find({
            participating: userId
        }).then(reserve => {
            reserve.map((reservas) => {
                console.log("funciona", reservas)
                reserveList.push(reservas.participating)
                console.log("funciona", reservas.participating)
                Event.findByIdAndDelete(reservas._id, function (err, reservas) {
                    if (err) {
                        console.log(err, "error que no conozco")
                    } else {
                        console.log("Reservas eliminadas correctamente")
                        reserveList.map((reserveId) => {
                            console.log("reserveId", reserveId)
                            Event.findByIdAndUpdate(reserveId, {
                                $pull: {
                                    participating: userId
                                }
                            })
                        })
                    }
                })
            })
        })
        let userCreateList = []
        Event.find({
            userCreate: userId
        }).then(event => {
            event.map((creador) => {
                console.log("funciona", creador)
                userCreateList.push(creador.userCreate)
                console.log("funciona", creador.userCreate)
                Event.findByIdAndDelete(creador._id, function (err, creador) {
                    if (err) {
                        console.log(err, "error que no conozco")
                    } else {
                        console.log("Creador del evento eliminado correctamente")
                        userCreateList.map((userCreateId) => {
                            console.log("userCreateId", userCreateId)
                            Event.findByIdAndUpdate(userCreateId, {
                                $pull: {
                                    userCreate: userId
                                }
                            })
                        })
                    }
                })
            })
        })


        return res.status(200).json({
            success: true,
            message: "El Usuario ha sido borrado"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// ****BORRAMOS NUESTRO USUARIO*****

UserRouter.delete("/deleteUser", auth, async (req, res) => {

    const {
        id
    } = req.user // Nos reconoce el usuario mediante el Tokken (auth.js)

    try {

        // // *****MANDA EL CORREO DE VERIFICACIÓN*****
        const user = await User.findById(id)
        const name = user.name
        const surname = user.surname
        const city = user.city
        const email = user.email
        byeEmail.sendByeEmail(
            name,
            surname,
            city,
            email,
        )

        // *****Funciones para borrar el usuario y todas sus reservas*****
        await User.findByIdAndDelete(id)
        let reserveList = []
        Reserve.find({
            participating: id
        }).then(e => {
            e.map((searches) => {
                console.log("funciona", searches)
                reserveList.push(searches.participating)
                console.log("funciona", searches.participating)
                Event.findByIdAndDelete(searches._id, function (err, searches) {
                    if (err) {
                        console.log(err, "error que no conozco")
                    } else {
                        console.log("Reservas eliminadas correctamente")
                        reserveList.map((reserveId) => {
                            console.log("reserveId", reserveId)
                            Event.findByIdAndUpdate(reserveId, {
                                $pull: {
                                    participating: id
                                }
                            })
                        })
                    }
                })
            })
        })

        let userCreateList = []
        Event.find({
            userCreate: id
        }).then(event => {
            event.map((creador) => {
                console.log("funciona", creador)
                userCreateList.push(creador.userCreate)
                console.log("funciona", creador.userCreate)
                Event.findByIdAndDelete(creador._id, function (err, creador) {
                    if (err) {
                        console.log(err, "error que no conozco")
                    } else {
                        console.log("Creador del evento eliminado correctamente")
                        userCreateList.map((userCreateId) => {
                            console.log("userCreateId", userCreateId)
                            Event.findByIdAndUpdate(userCreateId, {
                                $pull: {
                                    userCreate: id
                                },
                                $push: {
                                    userCreate: "Usuario_No_existente"
                                }
                            })
                        })
                    }
                })
            })
        })


        return res.status(200).json({
            success: true,
            message: "El Usuario ha sido borrado"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


// *****FUNCION PARA LOGUEARSE*****
UserRouter.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body
    try {
        let user = await User.findOne({
            email
        })

        re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        // *****CREAMOS COMPROBACIONES*****
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "No has completado todos los campos"
            })
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "El Usuario no está registrado"
            })
        }

        if (!re.exec(email)) {
            return res.status(400).json({
                success: false,
                message: "El formato del Email no es correcto"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "El Password debe contener 6 dígitos o más"
            })
        }

        let passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
            return res.status(400).json({
                success: false,
                message: "Password Incorrecto"
            })
        }

        const name = user.name
        const role = user.role
        const token = accessToken({
            id: user._id
        })

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 12 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({
            success: true,
            message: "Usuario Logueado correctamente",
            role,
            name
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

const accessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "12h"
    })
}

// *****EXPORTAMOS*****
module.exports = UserRouter