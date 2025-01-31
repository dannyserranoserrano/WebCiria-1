// *****IMPORTAMOS*****
const mongoose = require("mongoose")

// *****CREAMOS EL SCHEMA*****
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})


// *****EXPORTAMOS*****
module.exports = mongoose.model("User", UserSchema)