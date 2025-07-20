const userDashboard = (req,res,next) =>{
    const { latestScore, bestScore, totalUploads, userActivityByTime, jobPostsByIndustry } = req.body;

    if (!latestScore || !bestScore || !totalUploads || !userActivityByTime || !jobPostsByIndustry){
        return res.status(400).json({
            message: "Missing required fields: latestScore, bestScore, totalUploads, userActivityByTime, jobPostsByIndustry"
        });
    }
    
    if (typeof latestScore !== 'number' || typeof bestScore !== 'number' || typeof totalUploads !== 'number' || 
        typeof userActivityByTime !== 'number' || typeof jobPostsByIndustry !== 'number') {
        return res.status(400).json({
            message: "All fields must be of type number"
        });
    }
    next();
}  
module.exports = userDashboard;
