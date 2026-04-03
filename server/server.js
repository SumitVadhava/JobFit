const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/connection");
const { specs, swaggerUi } = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const supportRoutes = require("./routes/supportRoutes");

const app = express();

const allowedOrigins = [
  "https://jobfit-delta.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://jobfit-s5v7.onrender.com",
];


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// connectDB();

let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("MongoDB Connected ✅");
  }
};

connectDatabase();


app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: "JobFit API Docs",
    customfavIcon: "/public/favicon.png",
    customCss: `
      .swagger-ui .topbar { background-color: #1b1b1b !important; }
      .swagger-ui .topbar .link svg { display: none !important; }
      .swagger-ui .topbar .link::before { content: ""; display: inline-block; width: 130px; height: 45px; background: url('/public/logo.png') no-repeat center center; background-size: contain; margin-right: 5px; }
      .swagger-ui .topbar-wrapper { display: flex !important; align-items: center !important; }
      .swagger-ui .download-url-wrapper { display: none !important; }
      .swagger-ui .dark-mode-toggle { margin-left: auto !important; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  })
);

app.get("/", (req, res) => res.json({ message: "Welcome to JobFit API (v1) 😊" }));
app.get("/ping", (req, res) => res.json({ message: "JobFit (v1) Ping!" }));

app.use("/api/auth", authRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/support", supportRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: true, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandeled Error:", err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`JobFit Server running at http://localhost:${PORT}`);
//   console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
// });

module.exports = app;