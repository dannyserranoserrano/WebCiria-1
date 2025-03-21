const express = require("express");
const AuthRouter = express.Router();

// Logout endpoint
AuthRouter.post("/auth/logout", (req, res) => {
    try {
        // Clear the token cookie without expires option
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = AuthRouter;