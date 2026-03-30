const job = (req, res, next) => {
  const {
    jobTitle,
    openings,
    department,
    experience,
    responsibilities,
    qualifications,
    companyName,
    location,
    workPlaceType,
    jobDescription,
    img,
    bookmarked,
  } = req.body;

  if (
    openings !== undefined &&
    (typeof openings !== "number" || Number.isNaN(openings) || openings <= 0)
  ) {
    return res.status(400).json({
      message: "Invalid data type for openings: expected a positive number",
    });
  }

  if (
    !jobTitle ||
    !openings ||
    !department ||
    !experience ||
    !responsibilities ||
    !qualifications ||
    !companyName ||
    !location ||
    !workPlaceType ||
    !jobDescription
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: jobTitle, openings, department, experience, responsibilities, qualifications, companyName, location, workPlaceType, jobDescription",
    });
  }
  next();
};
module.exports = job;
