const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobFit - Recruitment Management REST API",
      version: "1.0.0",
      description: `## 🚀 Project Overview
<br />

**JobFit** is a sophisticated, production-ready recruitment ecosystem designed to seamlessly connect skilled professionals with the right opportunities. 

This document outlines the structured, high-performance RESTful API that powers the entire JobFit platform. Developed with a focus on **security, scalability, and developer experience (DX)**.

<br />

### 🛠️ Technical Foundation
- **Back-End API**: Node.js & Express.js.
- **Persistence Layer**: MongoDB Atlas via Mongoose.
- **Hosting Strategy**: Performance-optimized deployment on Render (Cloud).
- **Data Exchange**: Standardized JSON envelopes across all endpoints.

---

## 🏗️ Architecture & Core Principles
<br />

#### 💻 MVC Architectural Pattern
Clean separation of concerns for simplified maintainability and rapid scaling:
- **Models**: Defines the data blueprint and schema validation rules.
- **Controllers**: Implementation of core business logic and request flows.
- **Routes**: Declarative endpoint definitions with integrated middleware.
- **Validation**: Strict schema-level and middleware-based data sanitization.

<br />

#### 📦 Standard Response Envelope
Predictable feedback for every request, ensuring consistent client-side handling:
\`\`\`json
{
  "error": false,
  "message": "Operation completed successfully",
  "data": { ... }
}
\`\`\`

<br />

#### 🛡️ Layered Security Middleware
Multi-stage request filtering to protect data integrity and system health:
- 🔐 **Authentication**: Real-time JWT signature and expiration verification.
- ⚖️ **Authorization**: Enforced RBAC (Role-Based Access Control).
- 📝 **Validation**: Robust checks for MongoDB ObjectIDs and request bodies.
- ☁️ **Cloud Streaming**: Multimedia assets are streamed directly to Cloudinary.

---

## 🔐 Authentication & Access Control
<br />

The platform implements a **Stateless JWT Security Model**. Once authenticated, clients must include the signed token in the \`Authorization\` header for all subsequent protected operations.

<br />

**Header Format:**
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

<br />

#### 🔑 Enrollment & Verification Methods
1.  **Standard Local Login**
    - Secure password hashing using **Bcrypt** with industry-standard salt rounds.
2.  **Google One-Tap OAuth 2.0**
    - Verified server-side integration via the official Google Auth Library.
3.  **Encrypted OTP Verification**
    - Email-based One-Time Password mandatory for secure account activation.

---

## 👥 Role-Based Access Control (RBAC)
<br />

Access to sensitive endpoints is strictly restricted based on the authenticated user's role profile.

<br />

| Role | Access Level | Strategic Capabilities |
| :--- | :--- | :--- |
| **\`admin\`** | Platform Governance | User lifecycle, job verification, global analytics, system oversight |
| **\`recruiter\`** | Talent Acquisition | Role posting, pipeline management, hiring logic, company branding |
| **\`candidate\`** | Talent Experience | Job discovery, application tracking, ATS analysis, professional profile |

<br />

> [!NOTE]
> Public endpoints such as **Testimonials** and **Authentication** do **not** require a Bearer token.

---

## ✨ Strategic Feature Ecosystem
<br />

### 🎯 ATS Score
Empowers candidates with data-driven insights into their professional compatibility.
- **Resume Parsing**: Direct secure handling of hosted resume archives.
- **NLP Analysis**: Uses Natural Language Processing to extract and normalize skills.
- **Alignment Metrics**: Returns a 0-100% compatibility score based on job requirements.

<br />

### 📋 Operations: Full Job Lifecycle
End-to-end management for professional job listings and organizational enrollment.
- **Dynamic Posting**: Comprehensive support with Cloudinary banner integration.
- **Auto-Decrement**: Openings are automatically updated in real-time upon hiring.
- **History Archiving**: Filled positions are moved to history archives automatically.

<br />

### 👤 Governance: Advanced Profile Hub
Dedicated profiles for both Recruitment and Candidate personas, tailored to specific needs.
- **Candidate Hub**: Professional bio, skill matrix, ATS history, and education tracking.
- **Recruiter Center**: Organizational identity, team metrics, and hiring performance.

<br />

### 📊 Insights: Real-Time Dashboards
Data-rich analytical visualizations for operational and administrative decision-making.
- **Admin Stats**: Global breakdown of candidates, companies, and evaluation trends.
- **Recruiter Metrics**: Personalized tracking of listings, applicants, and hire rates.

<br />

### 💬 Connectivity: Testimonials
Public-facing success stories that build community trust and platform prestige.
- **User Submissions**: Authenticated **Candidates** and **Recruiters** can submit success stories with 1-5 star ratings.
- **Public Discovery**: All verified reviews are readable by everyone on the platform via the landing page.
- **Platform Integrity**: Only **Admins** have the delegated authority to delete or manage testimonial content.

<br />

---

## 🛑 Standard API Response Codes
<br />

| Code | Status | Meaningful Description |
| :--- | :--- | :--- |
| **\`200\`** | OK | Request was successful and data is enclosed. |
| **\`201\`** | Created | Resource has been persisted successfully. |
| **\`400\`** | Bad Request | Validation failed or request payload is malformed. |
| **\`401\`** | Unauthorized | Bearer token is missing, expired, or invalid. |
| **\`403\`** | Forbidden | Token is valid, but the user role lacks permissions. |
| **\`404\`** | Not Found | The requested resource or path does not exist. |
| **\`500\`** | System Error | An unexpected server-side exception occurred. |

---

## 📞 Contact & Technical Support
<br />

The **JobFit API** is maintained by the dedicated development team. For technical assistance, integration queries, or bug reports, please reach out via the following channels:

- 👥 **Support Team**: JobFit Development Team
- 📧 **Main Support Email**: [jobfits024@gmail.com](mailto:jobfits024@gmail.com)
- 🌐 **Official Platform**: [jobfit-delta.vercel.app](https://jobfit-delta.vercel.app)

<br />
---
`,
    },
    servers: [
      {
        url: "https://jobfit-s5v7.onrender.com",
        description: "Production Server (Render Deployment)",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Sandbox",
      },
    ],
    tags: [
      { name: "Auth", description: "User authentication & registration" },
      { name: "Admin", description: "Admin specific operations (Dashboard, Users)" },
      { name: "Admin-Jobs", description: "Admin job operations (Manage Jobs, Companies)" },
      { name: "Candidate", description: "Candidate specific operations (Dashboard, ATS, Profile)" },
      { name: "Candidate-Jobs", description: "Candidate job operations (Browse, Apply, Save)" },
      { name: "Recruiter", description: "Recruiter specific operations (Dashboard, Profile)" },
      { name: "Recruiter-Jobs", description: "Recruiter job operations (Post, Browse, Manage Applicants)" },
      { name: "Support", description: "Support & Helpdesk Operations" },
      { name: "Testimonial", description: "Platform Engagement & User Success Stories" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        // --- Authentication ---
        SignupRequest: {
          type: "object",
          required: ["userName", "email", "password", "role"],
          properties: {
            userName: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "Secret@123" },
            role: { type: "string", enum: ["candidate", "recruiter", "admin"], example: "candidate" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", format: "password", example: "Secret@123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            error: { type: "boolean", example: false },
            message: { type: "string", example: "Operation successful" },
            data: {
              type: "object",
              properties: {
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
        },

        // --- OTP ---
        SendOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
          },
        },
        VerifyOtpRequest: {
          type: "object",
          required: ["email", "otp"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            otp: { type: "string", example: "123456" },
          },
        },

        // --- User ---
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            userName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", example: "candidate" },
            picture: { type: "string", example: "https://example.com/profile.jpg" },
            authProvider: { type: "string", enum: ["local", "google"], example: "local" },
          },
        },

        // --- Jobs ---
        Job: {
          type: "object",
          required: ["jobTitle", "companyName", "location", "openings", "jobDescription"],
          properties: {
            _id: { type: "string", readOnly: true },
            recruiterId: { type: "string", readOnly: true },
            jobTitle: { type: "string", example: "Frontend Developer" },
            companyName: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Remote" },
            department: { type: "string", example: "Engineering" },
            openings: { type: "number", example: 2 },
            experience: { type: "string", example: "2-3 years" },
            jobDescription: { type: "string", example: "Building modern UIs..." },
            responsibilities: { type: "array", items: { type: "string" } },
            qualifications: { type: "array", items: { type: "string" } },
            workPlaceType: { type: "string", enum: ["Remote", "On-site", "Hybrid"], example: "Remote" },
            img: { type: "string", example: "https://example.com/job-banner.jpg" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
          },
        },

        // --- Saved Jobs ---
        SavedJob: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true, example: "64abc123def456" },
            userId: { type: "string", readOnly: true, example: "64abc123def457" },
            jobId: { $ref: '#/components/schemas/Job' },
            saved: { type: "boolean", example: true, description: "Job saved status (true) or unsaved (false)" },
            savedAt: { type: "string", format: "date-time", readOnly: true },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },

        SavedJobPatchRequest: {
          type: "object",
          required: ["saved"],
          properties: {
            saved: { type: "boolean", example: true, description: "Set to true to save job, false to unsave" },
          },
        },

        Testimonial: {
          type: "object",
          description: "Representational model of a verified user success story or platform review.",
          properties: {
            _id: { type: "string", readOnly: true, example: "64abc123def456" },
            username: { type: "string", description: "Display name of the user providing the testimonial", example: "Sumit Vadhava" },
            rating: { type: "number", minimum: 1, maximum: 5, description: "Numerical rating on a scale of 1 to 5 stars", example: 5 },
            reviewmsg: { type: "string", description: "Detailed narrative of the user's experience with JobFit", example: "The ATS analyzer is a game changer!" },
            date: { type: "string", format: "date-time", description: "Standard ISO timestamp of when the review was captured", readOnly: true },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        TestimonialRequest: {
          type: "object",
          required: ["username", "rating", "reviewmsg"],
          description: "Payload structure for submitting new platform testimonials.",
          properties: {
            username: { type: "string", description: "Full name or username to be displayed publicly", example: "Sumit Vadhava" },
            rating: { type: "number", minimum: 1, maximum: 5, description: "User rating from 1 (lowest) to 5 (highest)", example: 5 },
            reviewmsg: { type: "string", description: "The content of the review/testimonial", example: "Excellent platform for local job discovery." },
          },
        },

        // --- Candidate Profile ---
        CandidateProfile: {
          type: "object",
          description: "Comprehensive professional profile for job seekers, including ATS metrics and skill matrices.",
          properties: {
            _id: { type: "string", readOnly: true },
            user: { type: "string", readOnly: true, description: "Reference to the globally unique User ID" },
            email: { type: "string", description: "Professional contact email", example: "candidate@example.com" },
            userName: { type: "string", description: "Full legal name or professional handle", example: "John Doe" },
            img: { type: "string", description: "Publicly accessible URL to the profile picture", example: "https://res.cloudinary.com/..." },
            resumeLink: { type: "string", description: "Cloud-hosted hyperlink to the normalized resume document (PDF/DOCX)", example: "https://link.to/resume.pdf" },
            description: { type: "string", description: "Professional summary or ‘About Me’ narrative", example: "Passionate Full-Stack Developer with a focus on cloud-native applications." },
            atsScore: { type: "number", description: "Proprietary AI-calculated score representing resume-job alignment", example: 85.5 },
            experience: { type: "string", description: "Total professional tenure", example: "5-7 years" },
            education: {
              type: "array",
              description: "Chronological academic background",
              items: {
                type: "object",
                properties: {
                  degree: { type: "string", example: "B.Tech in Computer Science" },
                  university: { type: "string", example: "Indian Institute of Technology" },
                  yearOfPassing: { type: "number", example: 2020 },
                },
              },
            },
            skills: {
              type: "array",
              description: "Core technical competencies and stack specialization",
              items: { type: "object", properties: { skillName: { type: "string", example: "React.js" } } },
            },
            softSkills: {
              type: "array",
              description: "Interpersonal and leadership competencies",
              items: { type: "object", properties: { skillName: { type: "string", example: "Agile Leadership" } } },
            },
          },
        },

        CandidateProfileRequest: {
          type: "object",
          description: "Schema for initializing or synchronizing candidate profile data (email update not allowed).",
          properties: {
            userName: { type: "string", example: "John Doe" },
            img: { type: "string", example: "https://example.com/profile.jpg" },
            resumeLink: { type: "string", example: "https://example.com/resume.pdf" },
            description: { type: "string", example: "Full-Stack Developer focused on modern web ecosystems." },
            atsScore: { type: "number", example: 85.5 },
            experience: { type: "string", example: "5+ years" },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  degree: { type: "string", example: "Master of Science" },
                  university: { type: "string", example: "Stanford University" },
                  yearOfPassing: { type: "number", example: 2018 },
                },
              },
            },
            skills: {
              type: "array",
              items: { type: "object", properties: { skillName: { type: "string", example: "Node.js" } } },
            },
            softSkills: {
              type: "array",
              items: { type: "object", properties: { skillName: { type: "string", example: "Problem Solving" } } },
            },
          },
        },

        // --- Recruiter Profile ---
        RecruiterProfile: {
          type: "object",
          description: "Recruiter-centric profile encompassing organization branding and recruitment performance data.",
          properties: {
            _id: { type: "string", readOnly: true },
            user: { type: "string", readOnly: true },
            email: { type: "string", description: "Corporate contact address", example: "recruiter@techcorp.com" },
            userName: { type: "string", example: "Jane Smith" },
            img: { type: "string", example: "https://example.com/avatar.jpg" },
            company: { type: "string", description: "Parent organization or agency name", example: "TechCorp Global" },
            position: { type: "string", description: "Designation within the organization", example: "Senior Talent Acquisition Manager" },
            description: { type: "string", description: "Recruiter biography or corporate tagline", example: "Scaling engineering teams at TechCorp since 2015." },
            location: { type: "string", example: "San Francisco, CA" },
            website: { type: "string", example: "https://techcorp.com" },
            linkedIn: { type: "string", example: "https://linkedin.com/in/janesmith" },
            jobsPosted: { type: "number", description: "Total job listings published on the platform", example: 15, readOnly: true },
            candidatesHired: { type: "number", description: "Total successful conversions/hires via JobFit", example: 8, readOnly: true },
            teamSize: { type: "number", description: "Number of members in the recruitment squad", example: 5 },
          },
        },

        RecruiterProfileRequest: {
          type: "object",
          description: "Model for updating recruiter-specific organizational and professional metadata (email update not allowed).",
          properties: {
            userName: { type: "string", example: "Jane Smith" },
            img: { type: "string", example: "https://example.com/profile.jpg" },
            company: { type: "string", example: "TechCorp Global" },
            position: { type: "string", example: "V.P. Engineering Recruitment" },
            description: { type: "string", example: "Expert in building high-performance technical teams." },
            location: { type: "string", example: "New York, NY" },
            website: { type: "string", example: "https://careers.techcorp.com" },
            linkedIn: { type: "string", example: "https://linkedin.com/in/janesmith" },
            teamSize: { type: "number", example: 12 },
          },
        },

        // --- Generic Responses ---
        SuccessResponse: {
          type: "object",
          description: "Standardized success envelope for all positive API responses.",
          properties: {
            error: { type: "boolean", description: "Always false for success scenarios", example: false },
            message: { type: "string", description: "Human-readable confirmation of the operation", example: "Resource updated successfully" },
            data: { type: "object", nullable: true, description: "Payload of the requested resource if applicable", example: null },
          },
        },
        ErrorResponse: {
          type: "object",
          description: "Standardized error wrapper for high-level error handling and debugging.",
          properties: {
            error: { type: "boolean", description: "Always true for unsuccessful requests", example: true },
            message: { type: "string", description: "A high-level explanation of the failure", example: "Authentication failed" },
            details: { type: "string", nullable: true, description: "Low-level system error or validation breakdown (Development only)", example: "JWT expired or signature mismatch" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };