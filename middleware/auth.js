const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        // Check for token in different places
        const token = req.header("Authorization") || 
                     req.cookies.token || 
                     req.headers['x-access-token'] ||
                     (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid Authentication: No token provided"
            })
        }

        // Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Authentication: Token verification failed"
                })
            }

            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = auth
