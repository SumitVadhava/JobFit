<div align="center">

<img src="client/public/favicon.png" alt="JobFit Logo" width="110" />

# JobFit

### _The Intelligent Full-Stack Job Portal_

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Swagger](https://img.shields.io/badge/API_Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

<br/>

**A production-ready, role-based job portal platform connecting Candidates, Recruiters, and Admins — powered by an AI-driven ATS Resume Scoring Engine.**

[🚀 Live Demo](https://jobfit-delta.vercel.app) · [📖 API Docs](https://jobfit-s5v7.onrender.com/api-docs) · [🐛 Report Bug](https://github.com/SumitVadhava/JobFit/issues) · [✨ Request Feature](https://github.com/SumitVadhava/JobFit/issues)

</div>

---

## 📋 Table of Contents

- [📌 Description](#description)
- [🌐 Live Demo](#live-demo)
- [🛠️ Tech Stack](#tech-stack)
- [✨ Features](#features)
- [🗂️ Project Structure](#project-structure)
- [🚀 Getting Started](#getting-started)
- [🔐 Environment Variables](#environment-variables)
- [📡 API Endpoints](#api-endpoints)
- [🖼️ GitHub Images Setup](#github-images-setup-docs-folder)
- [📸 Screenshots](#screenshots)
- [🧩 Architecture Gallery](#architecture-gallery)
- [🏗️ System Design Deep Dive](#system-design-deep-dive)
- [📈 Engineering Highlights](#engineering-highlights)
- [🤝 Contributing](#contributing)
- [📬 Contact](#contact)

---

## 📌 Description

**JobFit** is a full-stack MERN job portal that bridges the gap between job seekers and recruiters through an intelligent, role-based experience. Unlike traditional job boards, JobFit features a built-in **ATS (Applicant Tracking System) Resume Scoring Engine** that analyzes resumes against job descriptions in real time, helping candidates understand their compatibility before applying.

### 🧠 Why JobFit

The modern hiring process is broken — candidates apply blindly, recruiters are overwhelmed with unqualified applications, and admins lack centralized oversight. JobFit solves this by:

- Giving **candidates** data-driven insights on resume-job fit before applying
- Empowering **recruiters** with a full candidate pipeline (Apply → Shortlist → Hire) and analytics dashboard
- Providing **admins** with a control center for user management, job moderation, and platform-wide analytics
- Sending **automated email notifications** at every stage of the hiring process via Nodemailer

### What I Learned

Building JobFit reinforced deep practical skills in JWT-based role authentication, Mongoose schema design, RESTful API architecture, Cloudinary media management, and building complex, multi-role React SPAs with Vite. I also gained production experience deploying a split frontend (Vercel) + backend (Render) architecture with proper CORS configuration.

---

## 🌐 Live Demo

- **Frontend:** [https://jobfit-delta.vercel.app](https://jobfit-delta.vercel.app)
- **Backend API:** [https://jobfit-s5v7.onrender.com](https://jobfit-s5v7.onrender.com)
- **Swagger API Docs:** [https://jobfit-s5v7.onrender.com/api-docs](https://jobfit-s5v7.onrender.com/api-docs)

<div align="center">

<img src="client/src/assets/logo_white_bg.png" alt="JobFit Landing Preview" width="90%" />

_JobFit Preview_

</div>

---

## 🛠️ Tech Stack

### Frontend

| Technology                     | Version   | Purpose                        |
| ------------------------------ | --------- | ------------------------------ |
| **React**                      | 19.x      | UI Framework                   |
| **Vite**                       | 7.x       | Build Tool & Dev Server        |
| **React Router DOM**           | 7.x       | Client-side Routing            |
| **Tailwind CSS**               | 3.x       | Utility-first Styling          |
| **MUI (Material UI)**          | 7.x       | UI Component Library           |
| **Framer Motion**              | 12.x      | Animations & Transitions       |
| **Recharts**                   | 3.x       | Data Visualization / Analytics |
| **Axios**                      | 1.x       | HTTP Client                    |
| **React Toastify**             | 11.x      | Toast Notifications            |
| **Formik + Yup**               | 2.x / 1.x | Form Handling & Validation     |
| **@react-oauth/google**        | 0.12.x    | Google OAuth Login             |
| **Lucide React + React Icons** | Latest    | Icon Libraries                 |
| **jwt-decode**                 | 4.x       | JWT Token Parsing              |
| **jsPDF**                      | 3.x       | PDF Resume Export              |

### Backend

| Technology             | Version   | Purpose                |
| ---------------------- | --------- | ---------------------- |
| **Node.js**            | 22.x LTS  | Runtime Environment    |
| **Express**            | 5.x       | Web Framework          |
| **MongoDB**            | Atlas     | Cloud Database         |
| **Mongoose**           | 8.x       | ODM / Schema Modeling  |
| **JSON Web Token**     | 9.x       | Authentication         |
| **bcrypt**             | 6.x       | Password Hashing       |
| **Cloudinary**         | 1.x       | Image / File Storage   |
| **Multer**             | 2.x       | File Upload Middleware |
| **Nodemailer**         | 7.x       | Email Notifications    |
| **Helmet**             | 8.x       | HTTP Security Headers  |
| **Swagger JSDoc + UI** | 6.x / 5.x | Auto API Documentation |
| **Morgan**             | 1.x       | HTTP Request Logging   |
| **dotenv**             | 17.x      | Environment Variables  |

---

## ✨ Features

- **Role-Based Authentication** — Three distinct user roles (Admin, Recruiter, Candidate) with JWT-secured routes and role-specific dashboards
- **ATS Resume Scoring Engine** — AI-powered resume analysis that scores candidates' resumes against job descriptions, providing match percentages and improvement suggestions
- **Full Candidate Pipeline** — Recruiters manage applicants through a complete workflow: `Applied → Shortlisted → Hired / Rejected` with automated email notifications at each stage
- **Multi-Role Analytics Dashboards** — Interactive charts (Recharts) for Candidates (application trends), Recruiters (job performance, hire rates), and Admins (platform-wide metrics)
- **Advanced Job Search & Filtering** — Candidates can search, filter by location/type/salary, and save jobs for later
- **Cloudinary Image Uploads** — Recruiters can upload company logos and branding assets (JPG, PNG, WEBP) directly from the dashboard
- **In-App + Email Notifications** — Candidates receive real-time notifications and email updates when shortlisted, hired, or rejected
- **Google OAuth Integration** — One-click sign-in with Google via `@react-oauth/google` alongside traditional email/password registration
- **Admin Control Panel** — Admins can manage all users, approve/reject job listings, review recruiter companies, and view platform analytics
- **Swagger API Documentation** — Fully documented REST API accessible at `/api-docs` with persistent authorization and live testing

---

## 🗂️ Project Structure

```
JobFit/
├── client/                          # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios API service modules
│   │   ├── assets/                  # Static assets (images, icons)
│   │   │   └── ...
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── recruiter/           # Recruiter-specific components
│   │   │   │   ├── RecruiterJobCard.jsx
│   │   │   │   ├── RecruiterCandidateCard.jsx
│   │   │   │   ├── RecruiterEditJobModal.jsx
│   │   │   │   ├── RecruiterDeleteConfirmModal.jsx
│   │   │   │   └── RecruiterSkeletons.jsx
│   │   │   ├── AdminAnalyticsWidgets.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── KeyFeature.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ResumeAnalysisReport.jsx
│   │   │   └── UserDropdown.jsx
│   │   ├── contexts/                # React Context providers
│   │   ├── pages/
│   │   │   ├── Admin/               # Admin dashboard pages
│   │   │   │   ├── AdminAnalytics.jsx
│   │   │   │   ├── Companies.jsx
│   │   │   │   ├── JobDescription.jsx
│   │   │   │   ├── JobFitUsersTable.jsx
│   │   │   │   └── Notifications.jsx
│   │   │   ├── Recruiter/           # Recruiter dashboard pages
│   │   │   │   ├── Recruiter_Post_view.jsx
│   │   │   │   ├── Recruiter_Posted_Jobs_view.jsx
│   │   │   │   ├── Recruiter_Candidates_view.jsx
│   │   │   │   ├── Recruiter_CandidateProfile_view.jsx
│   │   │   │   ├── Recruiter_Analytics_view.jsx
│   │   │   │   ├── Recruiter_History.jsx
│   │   │   │   └── Recruiter_Profile_view.jsx
│   │   │   └── User/                # Candidate dashboard pages
│   │   │       ├── User_JobSearch_view.jsx
│   │   │       ├── User_ApplyJob_view.jsx
│   │   │       ├── User_AppliedJobs_view.jsx
│   │   │       ├── User_SavedJobs_view.jsx
│   │   │       ├── User_Ats_view.jsx
│   │   │       ├── User_Analytics_view.jsx
│   │   │       ├── User_Resumes_View.jsx
│   │   │       └── Candidate_Profile_View.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/
│   └── assets/                      # Documentation assets (screenshots + architecture diagrams)
│
└── server/                          # Node.js + Express Backend
    ├── ATS/
    │   └── resume.js                # ATS Resume Scoring Engine
    ├── config/
    │   └── connection.js            # MongoDB connection
    ├── controllers/                 # Route controllers / business logic
    ├── middlewares/
   │   ├── adminMiddleware.js
   │   ├── authMiddleware.js
   │   ├── candidateMiddleware.js
   │   ├── commonMiddleware.js
   │   ├── recruiterMiddleware.js
   │   ├── testimonialMiddleware.js
   │   └── uploadMiddleware.js
    ├── models/                      # Mongoose schemas
   │   ├── adminDashboard.js
   │   ├── applications.js
   │   ├── atsHistory.js
   │   ├── candidateProfile.js
   │   ├── jobs.js
   │   ├── recruiterDashboard.js
   │   ├── recruiterProfile.js
   │   ├── resume.js
    │   ├── savedJobs.js
   │   ├── testimonial.js
    │   ├── userDashboard.js
   │   └── users.js
    ├── routes/                      # Express route definitions
   │   ├── adminRoutes.js
   │   ├── authRoutes.js
   │   ├── candidateRoutes.js
   │   ├── recruiterRoutes.js
   │   ├── supportRoutes.js
   │   └── testimonialRoutes.js
   ├── public/                      # Static assets (logo/favicon for docs)
    ├── services/                    # External service integrations
    ├── utils/
    │   └── roles.js                 # Roles & permissions constants
    ├── swagger.js                   # Swagger/OpenAPI specification
    ├── .env.example                 # Environment variable template
    ├── server.js                    # App entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) `>= 9.x`
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/SumitVadhava/JobFit.git
cd JobFit
```

---

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create your environment file from the example
cp .env.example .env
```

> Now edit `.env` and fill in your credentials. See the [Environment Variables](#environment-variables) section below.

```bash
# Start the backend development server
npm run dev
```

Server will be running at `http://localhost:7100`
Swagger API docs available at `http://localhost:7100/api-docs`

---

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Create your frontend environment file
# Create a file called .env in the /client directory
```

Add the following to `client/.env`:

```env
VITE_API_URL=http://localhost:7100
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

```bash
# Start the frontend development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

---

### 4. Access the App

| Role          | Access                                               |
| ------------- | ---------------------------------------------------- |
| **Candidate** | Register → Browse & apply to jobs, use ATS scanner   |
| **Recruiter** | Register as Recruiter → Post jobs, manage candidates |
| **Admin**     | Requires admin role in DB → Full platform control    |

---

## 🔐 Environment Variables

Create a `.env` file inside the `/server` directory using `.env.example` as a template.

| Variable                | Description                                       | Example                                              |
| ----------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `PORT`                  | Port for the Express server                       | `7100`                                               |
| `NODE_ENV`              | Runtime environment mode                          | `development`                                        |
| `MONGODB_URI`           | MongoDB Atlas connection string                   | `mongodb+srv://user:pass@cluster.mongodb.net/jobfit` |
| `MONGODB_DNS_SERVERS`   | Custom DNS servers for Atlas connectivity         | `8.8.8.8,1.1.1.1`                                    |
| `JWT_SECRET`            | Secret key for signing JWT tokens (min. 32 chars) | `your-super-secret-key-here-32chars`                 |
| `JWT_EXPIRES_IN`        | JWT token expiration duration                     | `1h`                                                 |
| `SMTP_USER`             | Gmail address used for Nodemailer                 | `yourapp@gmail.com`                                  |
| `SMTP_PASS`             | Gmail App Password (not your account password)    | `abcd efgh ijkl mnop`                                |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                        | `my-cloud-name`                                      |
| `CLOUDINARY_API_KEY`    | Cloudinary API Key                                | `123456789012345`                                    |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret                             | `your-cloudinary-api-secret`                         |
| `GOOGLE_SCRIPT_URL`     | Google Apps Script endpoint for OTP email flow    | `https://script.google.com/macros/s/.../exec`        |

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 📡 API Endpoints

> All protected routes require a `Bearer <token>` in the `Authorization` header.
> Full interactive documentation is available at `/api-docs`.

### Authentication

| Method | Endpoint                      | Description                                   | Auth Required |
| ------ | ----------------------------- | --------------------------------------------- | ------------- |
| `POST` | `/api/auth/signup/send-otp`   | Send OTP for email verification during signup | No            |
| `POST` | `/api/auth/signup/verify-otp` | Verify signup OTP                             | No            |
| `POST` | `/api/auth/signup`            | Register a new user                           | No            |
| `POST` | `/api/auth/login`             | Login with email & password                   | No            |
| `POST` | `/api/auth/google-login`      | Login / Register using Google token           | No            |

### Candidate (`/api/candidate`)

| Method   | Endpoint                            | Description                                | Auth Required |
| -------- | ----------------------------------- | ------------------------------------------ | ------------- |
| `GET`    | `/api/candidate/profile/:profileId` | Get candidate public profile by profile ID | No            |
| `GET`    | `/api/candidate/dashboard`          | Candidate dashboard statistics             | Candidate     |
| `GET`    | `/api/candidate/ats-analyzer`       | Candidate ATS score history                | Candidate     |
| `GET`    | `/api/candidate/profile`            | Get logged-in candidate profile            | Candidate     |
| `POST`   | `/api/candidate/profile`            | Create candidate profile                   | Candidate     |
| `PUT`    | `/api/candidate/profile`            | Update candidate profile                   | Candidate     |
| `DELETE` | `/api/candidate/profile`            | Delete candidate profile                   | Candidate     |
| `GET`    | `/api/candidate/jobs`               | Browse all available jobs                  | Candidate     |
| `GET`    | `/api/candidate/jobs/:jobId`        | View job details                           | Candidate     |
| `PUT`    | `/api/candidate/jobs/:jobId`        | Update candidate-job action (`withdraw`)   | Candidate     |
| `POST`   | `/api/candidate/job/apply`          | Apply to a job                             | Candidate     |
| `GET`    | `/api/candidate/saved-jobs`         | Get saved jobs                             | Candidate     |
| `PATCH`  | `/api/candidate/saved-jobs/:jobId`  | Save/unsave a job                          | Candidate     |
| `GET`    | `/api/candidate/applied-jobs`       | Get applied jobs                           | Candidate     |

### Recruiter (`/api/recruiter`)

| Method   | Endpoint                                          | Description                                | Auth Required |
| -------- | ------------------------------------------------- | ------------------------------------------ | ------------- |
| `GET`    | `/api/recruiter/profile/:profileId`               | Get recruiter public profile by profile ID | No            |
| `GET`    | `/api/recruiter/dashboard`                        | Recruiter dashboard statistics             | Recruiter     |
| `GET`    | `/api/recruiter/profile`                          | Get logged-in recruiter profile            | Recruiter     |
| `POST`   | `/api/recruiter/profile`                          | Create recruiter profile                   | Recruiter     |
| `PUT`    | `/api/recruiter/profile`                          | Update recruiter profile                   | Recruiter     |
| `PATCH`  | `/api/recruiter/profile`                          | Partial profile update                     | Recruiter     |
| `DELETE` | `/api/recruiter/profile`                          | Delete recruiter profile                   | Recruiter     |
| `POST`   | `/api/recruiter/jobs`                             | Post a job (`multipart/form-data`)         | Recruiter     |
| `GET`    | `/api/recruiter/jobs`                             | Get recruiter active jobs                  | Recruiter     |
| `GET`    | `/api/recruiter/jobs/history`                     | Get completed jobs history                 | Recruiter     |
| `GET`    | `/api/recruiter/applicants?jobId=...`             | Get applicants (optional job filter)       | Recruiter     |
| `PATCH`  | `/api/recruiter/applicants/:applicationId/status` | Update application status                  | Recruiter     |
| `DELETE` | `/api/recruiter/jobs/:jobId`                      | Delete a job (if allowed)                  | Recruiter     |

### Admin

| Method   | Endpoint                     | Description                                  | Auth Required |
| -------- | ---------------------------- | -------------------------------------------- | ------------- |
| `GET`    | `/api/admin/dashboard`       | Platform dashboard metrics                   | Admin         |
| `GET`    | `/api/admin/users`           | Get all users (candidate + recruiter)        | Admin         |
| `PATCH`  | `/api/admin/users/:id`       | Update user name/email                       | Admin         |
| `DELETE` | `/api/admin/users/:id`       | Delete a user and profile                    | Admin         |
| `GET`    | `/api/admin/jobs`            | Get all jobs with details                    | Admin         |
| `PATCH`  | `/api/admin/jobs/status/:id` | Update job status (`pending/verified/risky`) | Admin         |
| `GET`    | `/api/admin/companies`       | Get companies aggregated from jobs           | Admin         |

### Testimonials

| Method   | Endpoint                | Description               | Auth Required          |
| -------- | ----------------------- | ------------------------- | ---------------------- |
| `GET`    | `/api/testimonials`     | Get platform testimonials | No                     |
| `GET`    | `/api/testimonials/:id` | Get testimonial by ID     | No                     |
| `POST`   | `/api/testimonials`     | Create testimonial        | Candidate or Recruiter |
| `DELETE` | `/api/testimonials/:id` | Delete testimonial        | Admin                  |

### Support

| Method | Endpoint               | Description                 | Auth Required |
| ------ | ---------------------- | --------------------------- | ------------- |
| `POST` | `/api/support/contact` | Submit support/contact form | No            |

### Health

| Method | Endpoint | Description          | Auth Required |
| ------ | -------- | -------------------- | ------------- |
| `GET`  | `/`      | API welcome response | No            |
| `GET`  | `/ping`  | API health ping      | No            |

---

## 🖼️ GitHub Images Setup (docs folder)

To make screenshots render reliably on GitHub:

1. Create/use this folder structure:
   ```
   JobFit/
   └── docs/
       └── assets/
           ├── ScreenShots/
           ├── system-layers.svg
           ├── request-lifecycle.svg
           ├── role-collaboration.svg
           ├── reliability-guardrails.svg
           └── system-design-deep-dive/
   ```
2. Place all README screenshots inside `docs/assets/ScreenShots/`.
3. Place system design SVG files in `docs/assets/` and `docs/assets/system-design-deep-dive/`.
4. Reference images with repository-relative paths, for example:
   ```md
   ![Landing](docs/assets/ScreenShots/Landing_Page.jpeg)
   ```
5. Commit and push the images with README updates.

> This avoids broken image links caused by local-only paths.

---

## 📸 Screenshots

> Product gallery sourced from `docs/assets/ScreenShots/`.

### Landing and Authentication

| Landing Page                                               | Login Page                                             |
| ---------------------------------------------------------- | ------------------------------------------------------ |
| ![Landing Page](docs/assets/ScreenShots/Landing_Page.jpeg) | ![Login Page](docs/assets/ScreenShots/Login_Page.jpeg) |

### Candidate Views

| Candidate Dashboard                                                      | Candidate Profile                                                    |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| ![Candidate Dashboard](docs/assets/ScreenShots/Candidate_Dashboard.jpeg) | ![Candidate Profile](docs/assets/ScreenShots/Candidate_Profile.jpeg) |

![Candidate ATS Analyzer](docs/assets/ScreenShots/Candidate_ATS_Analyzer.jpeg)

### Recruiter Views

| Recruiter Dashboard                                                      | Recruiter Post Job                                                     |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| ![Recruiter Dashboard](docs/assets/ScreenShots/Recruiter_Dashboard.jpeg) | ![Recruiter Post Job](docs/assets/ScreenShots/Recruiter_Post_Job.jpeg) |

| Candidates Applications                                                                    | Recruiter Profile                                                    |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| ![Recruiter Candidates Applications](docs/assets/ScreenShots/Candidates_Applications.jpeg) | ![Recruiter Profile](docs/assets/ScreenShots/Recruiter_Profile.jpeg) |

### Admin View

![Admin Dashboard](docs/assets/ScreenShots/Admin_Dashboard.jpeg)

### Landing Sections

| Key Features Section                                                      | FAQ Section                                                     |
| ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| ![Key Features Section](docs/assets/ScreenShots/Jobfit_Key_Features.jpeg) | ![FAQ Section](docs/assets/ScreenShots/Jobfit_FAQ_Section.jpeg) |

---

## 🧩 Architecture Gallery

These visuals provide a quick high-level view of system boundaries, request flow, role collaboration, and reliability guardrails.

### Layered System Architecture

![System Layers](docs/assets/system-layers.svg)

### End-to-End Request Lifecycle

![Request Lifecycle](docs/assets/request-lifecycle.svg)

### Role Collaboration Matrix

![Role Collaboration](docs/assets/role-collaboration.svg)

### Reliability Guardrails

![Reliability Guardrails](docs/assets/reliability-guardrails.svg)

---

## 🏗️ System Design Deep Dive

This section provides a modular SVG architecture gallery for professional review, presentation, and PDF export quality.

Each subsection maps one system concern to one dedicated visual artifact.

### Context Diagram (C4 Level 1)

![Context Diagram](docs/assets/system-design-deep-dive/context-c4.svg)

### Container/Module Architecture (C4 Level 2)

![Container Architecture](docs/assets/system-design-deep-dive/container-architecture.svg)

### Authentication and Authorization Sequence

![Auth Sequence](docs/assets/system-design-deep-dive/auth-sequence.svg)

### Signup + OTP Verification Sequence

![OTP Sequence](docs/assets/system-design-deep-dive/signup-otp-sequence.svg)

### Job Application Lifecycle State Diagram

![Application State Diagram](docs/assets/system-design-deep-dive/job-application-state.svg)

### Hiring Flow and Notification Side Effects

![Hiring Flow](docs/assets/system-design-deep-dive/hiring-flow-notifications.svg)

### Resume and ATS Analysis Data Flow

![ATS Data Flow](docs/assets/system-design-deep-dive/resume-ats-dataflow.svg)

### Deployment Topology Graph

![Deployment Topology](docs/assets/system-design-deep-dive/deployment-topology.svg)

---

## 📈 Engineering Highlights

- Security and Access Control: JWT-based auth, role-gated routes, and validation middleware across protected domains.
- Reliability: Structured error handling, integration-safe controller flows, and clear API error envelopes.
- Scalability Readiness: Domain-separated controllers/models with clear extension points for pagination, caching, and queue-based workflows.
- Deployment Quality: Production split deployment on Vercel (frontend) and Render (backend) with Swagger docs and CORS-controlled access.

---

## 🤝 Contributing

Contributions are what make the developer community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes with a descriptive message
   ```bash
   git commit -m "feat: add AmazingFeature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request on GitHub

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Description                                |
| ----------- | ------------------------------------------ |
| `feat:`     | A new feature                              |
| `fix:`      | A bug fix                                  |
| `docs:`     | Documentation changes                      |
| `style:`    | Formatting, missing semicolons, etc.       |
| `refactor:` | Code restructuring without feature changes |
| `test:`     | Adding or fixing tests                     |
| `chore:`    | Maintenance tasks                          |

> Please ensure your PR passes all linting checks: `npm run lint` in `/client`.

---

## 📬 Contact

<div align="center">

Built by ❤️ **Code Conquerors**

|                    |                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **👥 Authors**     | Sumit Vadhava, Harshil Solanki, Viraj Odedra, Jasmin Chauhan, Manav Kotecha, Meet Parmar |
| **🐙 GitHub**      | [@SumitVadhava](https://github.com/SumitVadhava)                                         |
| **💼 LinkedIn**    | [JobFit Organization](https://www.linkedin.com/in/jobfit-organization-5344663b3)         |
| **📸 Instagram**   | [@jobfit_official](https://www.instagram.com/jobfit_official/)                           |
| **📰 X (Twitter)** | [@JobFit_Official](https://x.com/JobFit_Official)                                        |
| **✉️ Email**       | [jobfits024@gmail.com](mailto:jobfits024@gmail.com)                                      |

<br/>

**If you found this project helpful, please give it a star.**

[![GitHub stars](https://img.shields.io/github/stars/SumitVadhava/JobFit?style=social)](https://github.com/SumitVadhava/JobFit/stargazers)

</div>

---

<div align="center">
  <sub>Made with ☕ and a lot of <code>console.log()</code> debugging</sub>
</div>
