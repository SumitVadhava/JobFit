const job = (req, res, next) => {
    const { jobTitle, department, responsibilities, qualifications, companyName, location, workPlaceType, jobDescription, img, bookmarked } = req.body;

    if (!jobTitle || !department || !responsibilities || !qualifications || !companyName || !location || !workPlaceType || !jobDescription) {
        return res.status(400).json({
            message: "Missing required fields: jobTitle, department, responsibilities, qualifications, companyName, location, workPlaceType, jobDescription"
        });
    }
    next();
}
module.exports = job;

