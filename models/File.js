// *****IMPORTAMOS*****
const mongoose = require("mongoose");

// *****CREAMOS EL SCHEMA*****
const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: String,
        required: true
    },
    image: {
        type: Object
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    event: {
        type: mongoose.Types.ObjectId,
        ref: "Event",
    }
}, {
    timestamps: true
})


// *****EXPORTAMOS*****
module.exports = mongoose.model("File", FileSchema)