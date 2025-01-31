// *****IMPORTAMOS*****
const express = require("express");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const Activity = require("../models/Activity");
const ActivityRouter = express.Router();

// *****VISUALIZAMOS LAS ACTIVIDADES*****
ActivityRouter.get("/activities", auth, async (req, res) => {
    let activity = await Activity.find({})
    return res.status(200).json({
        success: true,
        activity
    })
})

// *****VISUALIZAR UNA ACTIVIDAD*****
ActivityRouter.get("/findActivity/:activityId", auth, async (req, res) => {
    const {
        activityId
    } = req.params
    try {
        let activity = await Activity.findById(activityId)
        if (!activity) {
            res.status(400).json({
                success: false,
                message: "Activity not found"
            })
        }
        return res.status(200).json({
            success: true,
            activity
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

// *****CREAMOS NUEVAS ACTIVIDADES*****
ActivityRouter.post("/newActivity", auth, authAdmin, async (req, res) => {
    const {
        name,
        pay
    } = req.body

    try {
        // *****Creamos los errores*****
        if (!name || !pay) {
            return res.status(400).json({
                success: false,
                message: "No has rellenado todos los campos"
            })
        }
        let activity = new Activity({
            name,
            pay
        })
        // *****Confirmación de guardado*****
        await activity.save()
        return res.status(200).json({
            success: true,
            message: "Actividad creada correctamente",
            activity
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }


})

// ****MODIFICAR DATOS DE LA ACTIVIDAD****
ActivityRouter.put("/updateActivity/:activityId", auth, authAdmin, async (req, res) => {
    const {
        activityId
    } = req.params
    const {
        name,
        pay
    } = req.body
    try {
        await Activity.findByIdAndUpdate(activityId, {
            name,
            pay
        })
        return res.status(200).json({
            success: true,
            message: ("La Actividad ha sido modificada")
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: error.message
        })
    }
})

// ****BORRAMOS ACTIVIDAD*****
ActivityRouter.delete("/deleteActivity/:activityId", auth, authAdmin, async (req, res) => {
    const {
        activityId
    } = req.params
    try {
        await Activity.findByIdAndDelete(activityId)
        return res.status(200).json({
            success: true,
            message: "La actividad ha sido borrada"
        })

    } catch (error) {
        return res.status(200).json({
            success: false,
            message: error.message
        })
    }
})

// *****EXPORTAMOS*****
module.exports = ActivityRouter