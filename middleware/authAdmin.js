const jwt = require("jsonwebtoken")
const User = require("../models/User")
const user = require("../models/User")

const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        })
        if (user.role === 0) {
            return res.status(400).send({
                success: false,
                message: "You are not activated as an administrator"
            })
        }

        next()

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = authAdmin