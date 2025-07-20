const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const resume = require('../middlewares/resumeMid');
const multer = require('multer');

// router.post('/resume/upload',)

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Call resume analysis API (replace with actual API endpoint)
    const analysisResponse = await axios.post('https://api.resume-analyzer.com/analyze', {
      file: fs.readFileSync(filePath), // Read PDF file as buffer
    }, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Optionally, delete the file after analysis to save space
    // fs.unlinkSync(filePath);

    // Send analysis result back to frontend
    res.json({
      success: true,
      analysis: analysisResponse.data,
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ success: false, message: 'Analysis failed' });
  }
});

router.post('/upload', resume, resumeController.uploadResume);
router.get('/:userId', resume, resumeController.getResumesByUserId);

module.exports = router;