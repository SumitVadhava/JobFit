const adminDashboard = (req,res,next) =>{
    const {totalSeekers , totalRecruiter, totalJobs, resumeEvaluted, userActivityByTime, jobPostsByIndustry} = req.body;

    if (!totalSeekers || !totalRecruiter || !totalJobs || !resumeEvaluted || !userActivityByTime || !jobPostsByIndustry){
        return res.status(400).json({
            message: "Missing required fields: totalSeekers, totalRecruiter, totalJobs, resumeEvaluted, userActivityByTime, jobPostsByIndustry"
        });
    }
    if (typeof totalSeekers !== 'number' || typeof totalRecruiter !== 'number' || typeof totalJobs !== 'number' || 
        typeof resumeEvaluted !== 'number' || typeof userActivityByTime !== 'number' || typeof jobPostsByIndustry !== 'number') {
        return res.status(400).json({
            message: "All fields must be of type number"
        });
    }
    next();
}
module.exports = adminDashboard;