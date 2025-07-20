// const axios = require('axios');
// const fs = require('fs');
// const router = express.Router();

// router.post('/upload', upload.single('resume'), async (req, res) => {
//   try {
//     const filePath = req.file.path;

//     // Call resume analysis API (replace with actual API endpoint)
//     const analysisResponse = await axios.post('https://jobfit-ats-api-1.onrender.com/', {
//       file: fs.readFileSync(filePath), // Read PDF file as buffer
//     }, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     // Optionally, delete the file after analysis to save space
//     // fs.unlinkSync(filePath);

//     // Send analysis result back to frontend
//     res.json({
//       success: true,
//       analysis: analysisResponse.data,
//     });
//   } catch (error) {
//     console.error('Error analyzing resume:', error);
//     res.status(500).json({ success: false, message: 'Analysis failed' });
//   }
// });

// module.exports = router;   

//-------------------------------
// const express = require('express');
// const axios = require('axios');
// const fs = require('fs');
// const multer = require('multer');
// const FormData = require('form-data');
// const path = require('path');

// const router = express.Router();

// // ✅ Define Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage }); // ✅ Now upload is defined
// const desc = `Entry-Level Data Analyst (Fresh Graduate Friendly)
//         We are seeking a highly motivated and detail-oriented Entry-Level Data Analyst to join our growing analytics team. This role is perfect for recent graduates who have a passion for working with data and uncovering actionable insights.
//         ✅ Responsibilities:
//         Collect, clean, and analyze large datasets using tools such as Python, Excel, and SQL
//         Develop interactive dashboards and visual reports using tools like Power BI, Tableau, or Excel
//         Perform exploratory data analysis (EDA) to identify trends, patterns, and outliers
//         Assist in the creation of weekly and monthly reporting workflows
//         Collaborate with business stakeholders to understand requirements and deliver data-driven insights
//         Document analytical procedures and findings clearly and concisely
//         🧠 Required Skills:
//         Proficiency in Python and libraries such as Pandas, NumPy, Matplotlib, Seaborn
//         Strong knowledge of SQL for querying and joining datasets
//         Hands-on experience with Power BI, Tableau, or similar BI tools
//         Intermediate to advanced Excel skills (VLOOKUP, PivotTables, formulas)
//         Understanding of basic statistics, such as regression, distributions, and hypothesis testing
//         Ability to communicate findings clearly with both technical and non-technical stakeholders
//         🎓 Qualifications:
//         Bachelor’s degree in Computer Science, Engineering, Mathematics, or related field (recent graduates encouraged)
//         Coursework or certifications in Data Analytics, SQL, or Python
//         Internship or project experience in data analysis is a plus
//         🌟 Nice to Have:
//         Experience with Git/GitHub version control
//         Familiarity with Google Analytics, data cleaning, or A/B testing
//         Exposure to cloud platforms (e.g., AWS, GCP, Azure) is a bonus
//         Knowledge of data storytelling and dashboard UX design
//         `;
// // 📌 Route: POST /api/resume/upload
// router.post('/upload', upload.single('pdf'),async (req, res) => {
//   try {
//     const filePath = req.file.path;

//     // Step 1: Create FormData to send the PDF as multipart/form-data
//     const formData = new FormData();
//     formData.append('pdf', fs.createReadStream(filePath));
//     formData.append('jobDesc',desc); // Attach file stream
  
//     // Step 2: Call external Resume Analysis API
//     // const analysisResponse = await axios.post('https://jobfit-ats-api-1.onrender.com/', formData, {
//     //   headers: formData.getHeaders(),
//     // });


    
//     const analysisResponse = await axios.post('https://jobfit-ats-api-1.onrender.com/', formData, {
//       headers: formData.getHeaders(),
//     });
    
//     // Step 3: Return analysis response
//     res.json({
//       success: true,
//       analysis: analysisResponse.data,
//     });

//     // Optional: clean up
//     // fs.unlinkSync(filePath);

//   } catch (error) {
//     console.error('Error analyzing resume:', error.message);
//     res.status(500).json({ success: false, message: 'Analysis failed' });
//   }
// });

// module.exports = router;

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const FormData = require('form-data');
const path = require('path');

const router = express.Router();

// Multer config to store uploaded PDFs in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST /api/resume/upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const jobDesc = req.body.jobDesc; // 👈 Received from frontend

    // Prepare multipart/form-data
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(filePath)); // 👈 Send PDF file
    formData.append('jobDesc', jobDesc);                  // 👈 Send Job Description text

    // Send to Python FastAPI backend
    const response = await axios.post('https://jobfit-ats-api-1.onrender.com/analyze', formData, {
      headers: formData.getHeaders(),
    });

    // Send the AI's response back to the frontend
    res.json({
      success: true,
      analysis: response.data,
    });

    // Optional: Clean up the uploaded file
    // fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Resume analysis error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to analyze resume' });
  }
});

module.exports = router;