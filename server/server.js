const express = require("express");
const { specs, swaggerUi } = require("./swagger");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const loginRouter = require("./routes/loginRouter");
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobRouter");
const adminDashboardRouter = require("./routes/adminDashboardRouter");
const adminCandidateRouter = require("./routes/adminCandidateRouter");
const adminRecruiterRouter = require("./routes/adminRecruiterRouter");
const userDashboardRouter = require("./routes/userDashboard");
const profileRouter = require("./routes/profileRouter");
const testimonialRouter = require("./routes/testimonialRouter");
const auth = require("./middlewares/auth");
const authorizeRole = require("./middlewares/authorizeRole");
const { ROLES, USER_FACING_ROLES } = require("./utils/roles");
const resumeRoute = require("./ATS/resume");
const atsHistoryRouter = require("./routes/atsHistoryRouter");
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
  "http://localhost:5000",
  "https://jobfit-s5v7.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
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
  }),
);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(
      "Bad JSON structure:",
      err.message,
      "at position",
      err.position,
    );
    return res
      .status(400)
      .send({ status: 400, message: "Invalid JSON format" });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the Jobfit made by Code Conquerors😊");
});

app.get("/ping", (req, res) => {
  res.send("Welcome to the Jobfit made by Code Conquerors😊");
});

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api", loginRouter);
app.use("/api/auth", authRouter);
app.use("/api/jobs", auth, jobRouter);
app.use("/api/admin", auth, authorizeRole(ROLES.ADMIN), adminDashboardRouter);
app.use(
  "/api/admin/candidates",
  auth,
  authorizeRole(ROLES.ADMIN),
  adminCandidateRouter,
);
app.use(
  "/api/admin/recruiters",
  auth,
  authorizeRole(ROLES.ADMIN),
  adminRecruiterRouter,
);
app.use(
  "/api/user",
  auth,
  authorizeRole(...USER_FACING_ROLES),
  userDashboardRouter,
);
app.use(
  "/api/profile",
  profileRouter,
);
app.use("/api/resume", auth, authorizeRole(...USER_FACING_ROLES), resumeRoute);
app.use(
  "/api/atshistory",
  auth,
  authorizeRole(...USER_FACING_ROLES),
  atsHistoryRouter,
);
app.use("/api/testimonials", testimonialRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: true, data: null, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
