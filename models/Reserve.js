// *****IMPORTAMOS*****
const mongoose = require("mongoose")

// *****CREAMOS EL SCHEMA*****
const ReserveSchema = new mongoose.Schema({
    event: {
        type: mongoose.Types.ObjectId,
        ref:"Event",
    },
    participating: {
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
}, {
    timestamps: true
})

// *****EXPORTAMOS*****
module.exports = mongoose.model("Reserve", ReserveSchema)