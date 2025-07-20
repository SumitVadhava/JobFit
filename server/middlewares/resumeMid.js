const resume = (req,res,next) => {
  const {resumeName, resumeDate, resumeFiles, atsScore } = req.body;

  if (!resumeName || !resumeDate || !resumeFiles || !atsScore) {
    return res.status(400).json({
      message: "Missing required fields: resumeName, resumeDate, resumeFiles, atsScore"
    });
  }

  next();
}
module.exports = resume;