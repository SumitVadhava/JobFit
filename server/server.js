const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/loginRouter");
const authRouter = require("./routes/auth");
// const helmet = require("helmet");
// const resumeroutes = require("./routes/resumeRouter");
const resumeRoute = require("./ATS/resume");
const path = require("path");
const multer = require('multer');
const fs = require('fs');
require("dotenv").config();
require("./config/connection")();


const app = express();

// Middlewares
// app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Root route
app.get("/", (req, res) => {
	res.send("Welcome to the Jobfit made by Code Conquerors😊");
});

app.get("/ping", (req, res) => {
	res.send("Welcome to the Jobfit made by Code Conquerors😊");
});
//resume route

// Global Error Handler	
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: true, data: null, message: "Internal Server Error" });
});

// other routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", loginRouter);
app.use("/api/auth",authRouter);
app.use('/api/resume', resumeRoute);

// app.use("/api/resume", resumeroutes);


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// // Set up storage for PDFs

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Store PDFs in uploads folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Routes

// // Create uploads directory if it doesn't exist
// const uploadDir = './uploads';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// Server
const PORT = process.env.PORT || 9705;
app.listen(PORT, () => {
	console.log(`🚀 Server is running at http://localhost:${PORT}`);
});


// Auto-load routes
// const routesPath = path.join(__dirname, "routes");
// fs.readdirSync(routesPath).forEach((file) => {
// 	if (file.endsWith(".router.js")) {
// 		const route = require(path.join(routesPath, file));
// 		const routePath = "/" + file.replace(".router.js", "");
// 		app.use(routePath, route);
// 	}
// });
// Set up storage for PDFs
