const jwt = require("jsonwebtoken");
require("dotenv").config();


const protect = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: true,
      data: null,
      message: "Access denied. No token provided.",
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      data: null,
      message: "Invalid or expired token.",
    });
  }
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        data: null,
        message: "Forbidden. You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { protect, authorize };