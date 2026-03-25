const express = require("express");
const { specs, swaggerUi } = require("./swagger");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const loginRouter = require("./routes/loginRouter");
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobRouter");
const adminDashboardRouter = require("./routes/adminDashboardRouter");
const userDashboardRouter = require("./routes/userDashboard");
const profileRouter = require("./routes/profileRouter");
const auth = require("./middlewares/auth");
const resumeRoute = require("./ATS/resume");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
require("./config/connection")();

const app = express();

const allowedOrigins = [
  "https://jobfit-delta.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://jobfit-s5v7.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: "JobFit API Docs",
    customCss: `
      .topbar { background-color: #0f172a !important; }
      .topbar-wrapper img { content: url(''); }
      .topbar-wrapper::after {
        content: '⚡ JobFit API';
        color: #38bdf8;
        font-size: 1.4rem;
        font-weight: 700;
        letter-spacing: 0.05em;
      }
      .swagger-ui .info .title { color: #38bdf8; }
      body { background-color: #0f172a; }
      .swagger-ui { color: #e2e8f0; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  }),
);

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls and tools that do not send an Origin header.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
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

// other routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", loginRouter);
app.use("/api/auth", authRouter);
app.use("/api/jobs", auth, jobRouter);
app.use("/api/admin", auth, adminDashboardRouter);
app.use("/api/user", auth, userDashboardRouter);
app.use("/api/profile", auth, profileRouter);
app.use("/api/resume", auth, resumeRoute);

// app.use("/api/resume", resumeroutes);

const uploadDir = path.join(__dirname, "uploads");
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

// Global Error Handler - must be after routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: true, data: null, message: "Internal Server Error" });
});

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
