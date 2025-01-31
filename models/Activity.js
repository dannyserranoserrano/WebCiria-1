// *****IMPORTAMOS*****
const mongoose = require("mongoose")

// *****CREAMOS EL SCHEMA*****
const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pay: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


// *****EXPORTAMOS*****
module.exports = mongoose.model("Activity", ActivitySchema)