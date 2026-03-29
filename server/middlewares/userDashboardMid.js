const userDashboard = (req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD") {
    return next();
  }

  const payload = req.body || {};
  const knownNumericFields = [
    "latestScore",
    "bestScore",
    "totalUploads",
    "userActivityByTime",
    "jobPostsByIndustry",
  ];

  for (const field of knownNumericFields) {
    if (payload[field] !== undefined && typeof payload[field] !== "number") {
      return res.status(400).json({
        message: `${field} must be of type number`,
      });
    }
  }

  if (payload.metrics !== undefined) {
    if (typeof payload.metrics !== "object" || Array.isArray(payload.metrics)) {
      return res.status(400).json({
        message: "metrics must be an object with numeric values",
      });
    }

    for (const [key, value] of Object.entries(payload.metrics)) {
      if (typeof value !== "number") {
        return res.status(400).json({
          message: `metrics.${key} must be of type number`,
        });
      }
    }
  }

  return next();
};

module.exports = userDashboard;
