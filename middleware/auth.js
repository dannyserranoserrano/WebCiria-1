const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token from cookie:", token);

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No authentication token found",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification error:", err);
        return res.status(401).send({
          success: false,
          message: "Invalid or expired token",
        });
      }

      console.log("Verified user:", user);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = auth;
