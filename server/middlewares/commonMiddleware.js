const mongoose = require("mongoose");

/**
 * Generic Middleware to validate MongoDB ObjectID from parameters
 * @param {string[]} paramNames Array of parameter names to validate (e.g. ['id', 'jobId'])
 */
const validateIds = (paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName] || req.query[paramName] || req.body[paramName];
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: true,
          message: `Invalid ID format for ${paramName}`,
        });
      }
    }
    next();
  };
};

module.exports = {
  validateIds,
};
