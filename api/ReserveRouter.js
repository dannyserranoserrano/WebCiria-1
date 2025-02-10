// *****IMPORTAMOS*****
const express = require("express");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const Reserve = require("../models/Reserve");
const Event = require("../models/Event");
const ReserveRouter = express.Router();

// *****VISUALIZAMOS TODAS LAS RESERVAS (admin)*****
ReserveRouter.get("/reserves", auth, authAdmin, async (req, res) => {
  try {
    const { id, role } = req.user;
    //let query = role === 1 ? {} : { participating: id };

    // Find reserves based on query and populate their data
    let reserves = await Reserve.find()
    .populate({
      path: "event",
      select: "dateActivity name",
    })
    .populate({
      path: "participating",
      select: "name surname",
    });

    if (!reserves || reserves.length === 0) {
      return res.json({
        success: false,
        message: "No hay reservas solicitadas",
      });
    }

    // Find and remove reserves with non-existent events
    const reservesToDelete = reserves.filter((reserve) => !reserve.event);
    if (reservesToDelete.length > 0) {
      await Promise.all(
        reservesToDelete.map((reserve) =>
          Reserve.findByIdAndDelete(reserve._id)
        )
      );
      // Refresh the reserves list after cleanup
      reserves = reserves.filter((reserve) => reserve.event);
    }

    return res.json({
      success: true,
      reserves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// *****VISUALIZAMOS TODAS MIS RESERVAS (user)*****
ReserveRouter.get("/myReserves", auth, async (req, res) => {
  try {
    const { id } = req.user;

    // Find reserves based on query and populate their data
    let reserves = await Reserve.find({ participating: id })
          .populate({
        path: "event",
        select: "name dateActivity",
      })
      .populate({
        path: "participating",
        select: "name surname",
      });


    if (!reserves || reserves.length === 0) {
      return res.json({
        success: false,
        message: "No hay reservas solicitadas",
      });
    }

    // Find and remove reserves with non-existent events
    const reservesToDelete = reserves.filter((reserve) => !reserve.event);
    if (reservesToDelete.length > 0) {
      await Promise.all(
        reservesToDelete.map((reserve) =>
          Reserve.findByIdAndDelete(reserve._id)
        )
      );
      // Refresh the reserves list after cleanup
      reserves = reserves.filter((reserve) => reserve.event);
    }

    return res.json({
      success: true,
      reserves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// *****VISUALIZAMOS NUESTRA RESERVA*****

ReserveRouter.get("/findReserve", auth, async (req, res) => {
  const { id } = req.user;
  try {
    // *****Buscar mis reservas (Como participante)*****

    // let reserves = await Reserve.find({}).populate({
    //     path: "participating",
    //     select: "_id"
    // })
    let reserveList = [];
    await Reserve.find({
      participating: id,
    }).then((reserve) => {
      reserve.map((reservas) => {
        console.log("funciona", reservas);
        reserveList.push(reservas.participating);
        console.log("funciona", reservas.participating);
      });
      console.log(reserveList);
      reserveList;
    });

    return res.json({
      success: true,
      reserveList,
    });

    //         let reserve = await Reserve.findById(id).populate({
    //             path: "participating",
    //             select: "name surname"
    //         }).populate({
    //             path: "event",
    //             select: "name"
    //         })
    //         if (!reserve) {
    //             res.json({
    //                 success: false,
    //                 message: "Reserva no encontrada"
    //             })
    //         }
    //         return res.json({
    //             success: true,
    //             message: "Reserva encontrada",
    //             reserve
    //         })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// *****VISUALIZAMOS SOLO UNA RESERVA*****
ReserveRouter.get("/findReserve/:reserveId", auth, async (req, res) => {
  const { reserveId } = req.params;
  try {
    let reserve = await Reserve.findById(reserveId)
      .populate({
        path: "participating",
        select: "name surname",
      })
      .populate({
        path: "event",
        select: "name",
      });
    if (!reserve) {
      res.json({
        success: false,
        message: "Reserva no encontrada",
      });
    }
    return res.json({
      success: true,
      message: "Reserva encontrada",
      reserve,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// *****CREAMOS UNA RESERVA PARA EL EVENTO*****
//**El usuario lo coge directamente por el tokken con req.user, y le metemos el id del evento al que nos inscribimos por parametros**
ReserveRouter.post("/newReserve/:eventId", auth, async (req, res) => {
  const { id } = req.user; // Nos reconoce el usuario mediante el Tokken (auth.js)
  const { eventId } = req.params;
  try {
    let findEvent = await Event.findById(eventId);
    if (!findEvent) {
      return res.json({
        success: false,
        message: "Este evento no existe",
      });
    }

    let newReserve = new Reserve({
      event: eventId,
      participating: id,
    });

    console.log(id);
    let findUser = await findEvent.participating.find((user) =>
      user._id.equals(id)
    ); //Comprueba si el usuario ya está registrado

    if (findUser) {
      return res.json({
        success: false,
        message: "Ya estás registrad@ en este evento",
      });
    }

    await Event.findByIdAndUpdate(eventId, {
      $push: {
        participating: id,
      },
    });

    await newReserve.save();

    return res.json({
      success: true,
      message: "Te has registrado como participante de este evento",
      newReserve,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// ****BORRAMOS RESERVA*****
ReserveRouter.delete("/deleteReserve/:reserveId", auth, async (req, res) => {
  const { reserveId } = req.params;
  const { id } = req.user;
  try {
    // Find the reserve first to get the event ID
    const reserve = await Reserve.findById(reserveId);
    if (!reserve) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    // Remove the participant from the event's participating array
    await Event.findByIdAndUpdate(reserve.event, {
      $pull: {
        participating: reserve.participating,
      },
    });

    // Delete the reserve
    await Reserve.findByIdAndDelete(reserveId);

    return res.status(200).json({
      success: true,
      message: "La reserva ha sido eliminada",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// *****EXPORTAMOS*****
module.exports = ReserveRouter;
