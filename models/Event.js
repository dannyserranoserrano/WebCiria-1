// *****IMPORTAMOS*****
const mongoose = require("mongoose")

// *****CREAMOS EL SCHEMA*****
const EventSchema = new mongoose.Schema({
    activity: {
        type: mongoose.Types.ObjectId,
        ref: "Activity",
    },
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userCreate: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    dateActivity: {
        type: String,
        required: true
    },
    file: {
        type: mongoose.Types.ObjectId,
        ref: "File"
    },
    participating: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
}, {
        timestamps: true
    })


// *****EXPORTAMOS*****
module.exports = mongoose.model("Event", EventSchema)