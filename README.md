<div align="center">

# 🎯 JobFit

### *The Intelligent Full-Stack Job Portal*

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Swagger](https://img.shields.io/badge/API_Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

<br/>

**A production-ready, role-based job portal platform connecting Candidates, Recruiters, and Admins — powered by an AI-driven ATS Resume Scoring Engine.**

[🚀 Live Demo](https://jobfit-delta.vercel.app) · [📖 API Docs](https://jobfit-s5v7.onrender.com/api-docs) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Description](#-description)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact--author)

---

## 📌 Description

**JobFit** is a full-stack MERN job portal that bridges the gap between job seekers and recruiters through an intelligent, role-based experience. Unlike traditional job boards, JobFit features a built-in **ATS (Applicant Tracking System) Resume Scoring Engine** that analyzes resumes against job descriptions in real time, helping candidates understand their compatibility before applying.

### 🧠 Why JobFit?

The modern hiring process is broken — candidates apply blindly, recruiters are overwhelmed with unqualified applications, and admins lack centralized oversight. JobFit solves this by:

- Giving **candidates** data-driven insights on resume-job fit before applying
- Empowering **recruiters** with a full candidate pipeline (Apply → Shortlist → Hire) and analytics dashboard
- Providing **admins** with a control center for user management, job moderation, and platform-wide analytics
- Sending **automated email notifications** at every stage of the hiring process via Nodemailer

### 💡 What I Learned

Building JobFit reinforced deep practical skills in JWT-based role authentication, Mongoose schema design, RESTful API architecture, Cloudinary media management, and building complex, multi-role React SPAs with Vite. I also gained production experience deploying a split frontend (Vercel) + backend (Render) architecture with proper CORS configuration.

---

## 🌐 Live Demo

🔗 **Frontend:** [https://jobfit-delta.vercel.app](https://jobfit-delta.vercel.app)
🔗 **Backend API:** [https://jobfit-s5v7.onrender.com](https://jobfit-s5v7.onrender.com)
📖 **Swagger API Docs:** [https://jobfit-s5v7.onrender.com/api-docs](https://jobfit-s5v7.onrender.com/api-docs)

<div align="center">

<!-- Screenshot Placeholder — replace with actual screenshot -->
<img src="assets/images/landing-page.png" alt="JobFit Landing Page" width="90%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);" />

*JobFit Landing Page — replace this placeholder with an actual screenshot*

</div>

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI Framework |
| **Vite** | 7.x | Build Tool & Dev Server |
| **React Router DOM** | 7.x | Client-side Routing |
| **Tailwind CSS** | 3.x | Utility-first Styling |
| **MUI (Material UI)** | 7.x | UI Component Library |
| **Framer Motion** | 12.x | Animations & Transitions |
| **Recharts** | 3.x | Data Visualization / Analytics |
| **Axios** | 1.x | HTTP Client |
| **React Toastify** | 11.x | Toast Notifications |
| **Formik + Yup** | 2.x / 1.x | Form Handling & Validation |
| **@react-oauth/google** | 0.12.x | Google OAuth Login |
| **Lucide React + React Icons** | Latest | Icon Libraries |
| **jwt-decode** | 4.x | JWT Token Parsing |
| **jsPDF** | 3.x | PDF Resume Export |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 22.x LTS | Runtime Environment |
| **Express** | 5.x | Web Framework |
| **MongoDB** | Atlas | Cloud Database |
| **Mongoose** | 8.x | ODM / Schema Modeling |
| **JSON Web Token** | 9.x | Authentication |
| **bcrypt** | 6.x | Password Hashing |
| **Cloudinary** | 1.x | Image / File Storage |
| **Multer** | 2.x | File Upload Middleware |
| **Nodemailer** | 7.x | Email Notifications |
| **Helmet** | 8.x | HTTP Security Headers |
| **Swagger JSDoc + UI** | 6.x / 5.x | Auto API Documentation |
| **Morgan** | 1.x | HTTP Request Logging |
| **dotenv** | 17.x | Environment Variables |

---

## ✨ Features

- 🔐 **Role-Based Authentication** — Three distinct user roles (Admin, Recruiter, Candidate) with JWT-secured routes and role-specific dashboards
- 🤖 **ATS Resume Scoring Engine** — AI-powered resume analysis that scores candidates' resumes against job descriptions, providing match percentages and improvement suggestions
- 📋 **Full Candidate Pipeline** — Recruiters manage applicants through a complete workflow: `Applied → Shortlisted → Hired / Rejected` with automated email notifications at each stage
- 📊 **Multi-Role Analytics Dashboards** — Interactive charts (Recharts) for Candidates (application trends), Recruiters (job performance, hire rates), and Admins (platform-wide metrics)
- 🔍 **Advanced Job Search & Filtering** — Candidates can search, filter by location/type/salary, and save jobs for later
- 🖼️ **Cloudinary Image Uploads** — Recruiters can upload company logos and branding assets (JPG, PNG, WEBP) directly from the dashboard
- 🔔 **In-App + Email Notifications** — Candidates receive real-time notifications and email updates when shortlisted, hired, or rejected
- 🔑 **Google OAuth Integration** — One-click sign-in with Google via `@react-oauth/google` alongside traditional email/password registration
- 👑 **Admin Control Panel** — Admins can manage all users, approve/reject job listings, review recruiter companies, and view platform analytics
- 📖 **Swagger API Documentation** — Fully documented REST API accessible at `/api-docs` with persistent authorization and live testing

---

## 📁 Project Structure

```
JobFit/
├── client/                          # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios API service modules
│   │   ├── assets/                  # Static assets (images, icons)
│   │   │   └── images/              # 📸 Place screenshots here
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
└── server/                          # Node.js + Express Backend
    ├── ATS/
    │   └── resume.js                # ATS Resume Scoring Engine
    ├── config/
    │   └── connection.js            # MongoDB connection
    ├── controllers/                 # Route controllers / business logic
    ├── middlewares/
    │   ├── auth.js                  # JWT verification middleware
    │   ├── authorizeRole.js         # Role-based access control
    │   └── jobsMid.js               # Job validation middleware
    ├── models/                      # Mongoose schemas
    │   ├── jobs.js
    │   ├── appliedJobs.js
    │   ├── savedJobs.js
    │   ├── candidateProfile.js
    │   ├── recruiterProfile.js
    │   ├── userDashboard.js
    │   ├── notification.js
    │   └── resume.js
    ├── routes/                      # Express route definitions
    │   ├── auth.js
    │   ├── loginRouter.js
    │   ├── jobRouter.js
    │   ├── profileRouter.js
    │   ├── recruiterProfileRouter.js
    │   ├── userDashboard.js
    │   ├── adminDashboardRouter.js
    │   ├── adminCandidateRouter.js
    │   ├── adminRecruiterRouter.js
    │   ├── atsHistoryRouter.js
    │   ├── resumeRouter.js
    │   └── testimonialRouter.js
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

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/JobFit.git
cd JobFit
```

---

### 2️⃣ Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create your environment file from the example
cp .env.example .env
```

> 📝 Now edit `.env` and fill in your credentials. See the [Environment Variables](#-environment-variables) section below.

```bash
# Start the backend development server
npm run dev
```

✅ Server will be running at `http://localhost:7100`
📖 Swagger API docs available at `http://localhost:7100/api-docs`

---

### 3️⃣ Frontend Setup

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

✅ Frontend will be running at `http://localhost:5173`

---

### 4️⃣ Access the App

| Role | Access |
|---|---|
| 🧑‍💼 **Candidate** | Register → Browse & apply to jobs, use ATS scanner |
| 🏢 **Recruiter** | Register as Recruiter → Post jobs, manage candidates |
| 👑 **Admin** | Requires admin role in DB → Full platform control |

---

## 🔑 Environment Variables

Create a `.env` file inside the `/server` directory using `.env.example` as a template.

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the Express server | `7100` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/jobfit` |
| `MONGODB_DNS_SERVERS` | Custom DNS servers for Atlas connectivity | `8.8.8.8,1.1.1.1` |
| `JWT_SECRET` | Secret key for signing JWT tokens (min. 32 chars) | `your-super-secret-key-here-32chars` |
| `JWT_EXPIRES_IN` | JWT token expiration duration | `1h` |
| `SMTP_USER` | Gmail address used for Nodemailer | `yourapp@gmail.com` |
| `SMTP_PASS` | Gmail App Password (not your account password) | `abcd efgh ijkl mnop` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your-cloudinary-api-secret` |

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 📡 API Endpoints

> All protected routes require a `Bearer <token>` in the `Authorization` header.
> Full interactive documentation is available at `/api-docs`.

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/register` | Register a new user | ❌ |
| `POST` | `/api/login` | Login with email & password | ❌ |
| `POST` | `/api/auth/google` | Login / Register via Google OAuth | ❌ |

### 💼 Jobs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs` | Get all job listings | ✅ |
| `POST` | `/api/jobs` | Create a new job (Recruiter) | ✅ Recruiter |
| `GET` | `/api/jobs/:id` | Get a specific job by ID | ✅ |
| `PUT` | `/api/jobs/:id` | Update a job (owner only) | ✅ Recruiter |
| `DELETE` | `/api/jobs/:id` | Delete a job | ✅ Recruiter / Admin |
| `POST` | `/api/jobs/:id/apply` | Apply for a job | ✅ Candidate |
| `POST` | `/api/jobs/:id/save` | Save a job for later | ✅ Candidate |
| `DELETE` | `/api/jobs/:id/unsave` | Unsave a job | ✅ Candidate |
| `PATCH` | `/api/jobs/:id/admin-review` | Admin review a job | ✅ Admin |

### 🎯 Recruiter Candidate Management

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs/recruiter/:recruiterId` | Get all jobs by a recruiter | ✅ Recruiter |
| `GET` | `/api/jobs/:jobId/candidates` | Get candidates for a specific job | ✅ Recruiter |
| `GET` | `/api/jobs/recruiter/:recruiterId/candidates` | Get all candidates across recruiter jobs | ✅ Recruiter |
| `PATCH` | `/api/jobs/:jobId/candidates/:appId/shortlist` | Shortlist a candidate | ✅ Recruiter |
| `PATCH` | `/api/jobs/:jobId/candidates/:appId/hire` | Hire a candidate | ✅ Recruiter |
| `PATCH` | `/api/jobs/:jobId/candidates/:appId/reject` | Reject a candidate | ✅ Recruiter |

### 👤 Profiles

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/profile` | Get candidate profile | ✅ |
| `POST` | `/api/profile` | Create candidate profile | ✅ |
| `PUT` | `/api/profile` | Update candidate profile | ✅ |
| `GET` | `/api/recruiter-profile` | Get recruiter profile | ✅ Recruiter |
| `PUT` | `/api/recruiter-profile` | Update recruiter profile | ✅ Recruiter |

### 🤖 ATS & Resumes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/resume/analyze` | Upload and ATS-score a resume vs. job description | ✅ Candidate |
| `GET` | `/api/atshistory` | Get ATS scan history for current user | ✅ Candidate |

### 👑 Admin

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Platform-wide stats | ✅ Admin |
| `GET` | `/api/admin/candidates` | List all candidates | ✅ Admin |
| `GET` | `/api/admin/recruiters` | List all recruiters | ✅ Admin |
| `DELETE` | `/api/admin/candidates/:id` | Delete a candidate | ✅ Admin |
| `DELETE` | `/api/admin/recruiters/:id` | Delete a recruiter | ✅ Admin |

### 📣 Misc

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/user/dashboard` | Candidate dashboard data | ✅ Candidate |
| `GET` | `/api/testimonials` | Get platform testimonials | ❌ |
| `POST` | `/api/testimonials` | Submit a testimonial | ✅ |

---

## 📸 Screenshots

> 📂 Place your screenshots inside `client/src/assets/images/` and update the paths below.

<details>
<summary>🏠 Landing Page</summary>

![Landing Page](assets/images/landing-page.png)

</details>

<details>
<summary>🔐 Authentication — Login / Register</summary>

![Auth Page](assets/images/auth-page.png)

</details>

<details>
<summary>🔍 Candidate — Job Search & Browse</summary>

![Job Search](assets/images/job-search.png)

</details>

<details>
<summary>🤖 Candidate — ATS Resume Scanner</summary>

![ATS Scanner](assets/images/ats-scanner.png)

</details>

<details>
<summary>📊 Candidate — Analytics Dashboard</summary>

![Candidate Analytics](assets/images/candidate-analytics.png)

</details>

<details>
<summary>🏢 Recruiter — Post a Job</summary>

![Post Job](assets/images/recruiter-post-job.png)

</details>

<details>
<summary>👥 Recruiter — Candidate Management Pipeline</summary>

![Candidate Management](assets/images/recruiter-candidates.png)

</details>

<details>
<summary>📈 Recruiter — Analytics Dashboard</summary>

![Recruiter Analytics](assets/images/recruiter-analytics.png)

</details>

<details>
<summary>👑 Admin — Control Panel</summary>

![Admin Dashboard](assets/images/admin-dashboard.png)

</details>

<details>
<summary>📖 Swagger — API Documentation</summary>

![Swagger Docs](assets/images/swagger-docs.png)

</details>

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

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

| Prefix | Description |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, missing semicolons, etc. |
| `refactor:` | Code restructuring without feature changes |
| `test:` | Adding or fixing tests |
| `chore:` | Maintenance tasks |

> Please ensure your PR passes all linting checks: `npm run lint` in `/client`.

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal or commercial purposes with attribution.

---

## 👨‍💻 Contact / Author

<div align="center">

Built with ❤️ by **Code Conquerors**

| | |
|---|---|
| 👤 **Author** | Sumit Vadhava |
| 🐙 **GitHub** | [@SumitVadhava](https://github.com/SumitVadhava) |
| 💼 **LinkedIn** | [Connect on LinkedIn](https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME) |
| 📧 **Email** | your.email@example.com |

<br/>

⭐ **If you found this project helpful, please give it a star!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/SumitVadhava/JobFit?style=social)](https://github.com/SumitVadhava/JobFit/stargazers)

</div>

---

<div align="center">
  <sub>Made with ☕ and a lot of <code>console.log()</code> debugging</sub>
</div>
