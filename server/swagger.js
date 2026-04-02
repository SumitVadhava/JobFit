const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
      description: `
## Overview
JobFit is a comprehensive job matching and resume analysis platform. Candidates can build profiles, upload resumes for ATS scoring, apply for jobs, and save listings. Recruiters can post jobs, manage candidate applications, review profiles, and update candidate statuses (shortlisted, hired, rejected). Admins have complete oversight over users, recruiters, and platform metrics with the ability to review jobs.

## Major Features
- **Role-based Authentication**: Email/Password & Google OAuth.
- **Recruiter Dashboard**: Job posting, candidate application management, status tracking (hire/shortlist/reject).
- **Candidate Dashboard**: Job discovery, application submission, saved jobs, ATS resume analysis.
- **ATS (Applicant Tracking System)**: Upload resumes and parse them for skills, education, and ATS scoring.
- **Admin Dashboard**: Full statistical overview, job review approvals/rejections, and CRUD operations for users/candidates.
- **Testimonial System**: Submit and view platform testimonials.

## Authentication
This API uses **JSON Web Token (JWT)** for securing endpoints. To authenticate requests:
1. Obtain a token by calling \`/api/login\` or \`/api/Google_login\`.
2. Pass the token in the \`Authorization\` header using the Bearer schema: \`Authorization: Bearer <your_jwt_token>\`.

## Role Permissions Summary
- **Admin**: Has full access. Can view platform statistics, manage candidates and recruiters (CRUD), update job admin review status (pending, reviewed, risky), and delete any job.
- **Recruiter**: Can create, read, update, and delete their own job postings. Can view candidates applied to their jobs and update status (shortlisted, hired, rejected). Cannot access other recruiters' data.
- **Candidate / User**: Can search jobs, view job details, apply for jobs, save/unsave jobs, build profiles, test ATS score, and view application history. Cannot manage jobs.

## Automatic Behaviors
- **Profile Synchronization**: When a user signs up, their profile entry (Candidate or Recruiter) is automatically initialized.
- **Resume Parsing**: When uploading a resume, ATS score and profile data are automatically calculated and populated using ML/AI checks.
- **Hiring Cascades**: When a candidate is "hired" for a job, the job's \`openings\` count is automatically decremented. The system can handle auto-rejection logic if openings reach zero.
- **Candidate Unique Counts**: Recruiter candidate stats are automatically aggregated representing unique applicants across all their active jobs.

## Step-by-step Testing Guide
1. **Login**: Use \`/api/login\` endpoint to authenticate and grab your \`token\`.
2. **Authorize**: Click the **Authorize** button in Swagger UI, paste the token (\`Bearer <token>\`), and click Save.
3. **Test API**: Now you can execute any endpoints permitted by your user role!
      `,
    },
    servers: [
      {
        url: "https://jobfit-s5v7.onrender.com",
        description: "Render Server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
      {
        url: "https://jobfit-delta.vercel.app",
        description: "Frontend",
      },
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
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Secret@123",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["userName", "email", "password", "role"],
          properties: {
            userName: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Secret@123",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "recruiter", "candidate"],
              example: "user",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
          },
        },
        GoogleLoginRequest: {
          type: "object",
          required: ["name", "email", "picture", "google_id"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            picture: {
              type: "string",
              example: "https://lh3.googleusercontent.com/a/profile-photo",
            },
            google_id: { type: "string", example: "1029384756" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            error: { type: "boolean", example: false },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        // ── OTP ──────────────────────────────────────────────────
        SendOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        },
        VerifyOtpRequest: {
          type: "object",
          required: ["email", "otp"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            otp: { type: "string", example: "123456" },
          },
        },
        // ── User ─────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            userName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: {
              type: "string",
              enum: ["admin", "user", "recruiter", "candidate"],
              example: "candidate",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
          },
        },
        // ── Job ──────────────────────────────────────────────────
        Job: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            recruiterId: {
              type: "string",
              example: "687c5aac240f88425de5edb1",
              description: "Recruiter owner id",
            },
            recruiterModel: {
              type: "string",
              enum: ["logins", "google_logins"],
              example: "google_logins",
              description: "Recruiter account source model",
            },
            jobTitle: { type: "string", example: "Software Engineer" },
            department: { type: "string", example: "Engineering" },
            openings: { type: "number", example: 3 },
            experience: { type: "string", example: "1-2 years" },
            responsibilities: {
              type: "string",
              example: "Develop and maintain software applications.",
            },
            qualifications: {
              type: "string",
              example:
                "Bachelor's degree in Computer Science or related field.",
            },
            companyName: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Bangalore, India" },
            workPlaceType: {
              type: "string",
              enum: ["remote", "onsite", "hybrid"],
              example: "remote",
            },
            jobDescription: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            img: {
              type: "string",
              example: "https://example.com/company-logo.jpg",
            },
            bookmarked: { type: "boolean", example: false },
            adminReview: {
              type: "string",
              enum: ["pending", "reviewed", "risky"],
              example: "pending",
            },
          },
        },
        JobRequest: {
          type: "object",
          required: [
            "jobTitle",
            "department",
            "openings",
            "experience",
            "responsibilities",
            "qualifications",
            "companyName",
            "location",
            "workPlaceType",
            "jobDescription",
          ],
          properties: {
            jobTitle: { type: "string", example: "Software Engineer" },
            department: { type: "string", example: "Engineering" },
            openings: { type: "number", example: 3 },
            experience: { type: "string", example: "1-2 years" },
            responsibilities: {
              type: "string",
              example: "Develop and maintain software applications.",
            },
            qualifications: {
              type: "string",
              example:
                "Bachelor's degree in Computer Science or related field.",
            },
            companyName: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Bangalore, India" },
            workPlaceType: {
              type: "string",
              enum: ["remote", "onsite", "hybrid"],
              example: "remote",
            },
            jobDescription: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            img: {
              type: "string",
              example: "https://example.com/company-logo.jpg",
            },
            bookmarked: { type: "boolean", example: false },
          },
        },
        AppliedJob: {
          type: "object",
          properties: {
            _id: { type: "string", example: "689f1d7b2c9b4f0012a34567" },
            userId: { type: "string", example: "687c5aac240f88425de5edb1" },
            userModel: {
              type: "string",
              enum: ["logins", "google_logins"],
              example: "google_logins",
            },
            jobId: { type: "string", example: "689f13f42c9b4f0012a34321" },
            status: {
              type: "string",
              enum: ["applied", "shortlisted", "rejected", "hired"],
              example: "applied",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-28T12:30:00.000Z",
            },
          },
        },
        ApplyJobResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Job applied successfully" },
            application: { $ref: "#/components/schemas/AppliedJob" },
          },
        },
        SaveJobResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Job saved successfully",
            },
            saved: {
              type: "boolean",
              example: true,
            },
          },
        },
        SavedJobItem: {
          type: "object",
          properties: {
            savedId: { type: "string", example: "689f1d7b2c9b4f0012a34567" },
            jobId: { type: "string", example: "689f13f42c9b4f0012a34321" },
            companyName: { type: "string", example: "TechCorp" },
            jobTitle: { type: "string", example: "Software Engineer" },
            location: { type: "string", example: "Bangalore, India" },
            department: { type: "string", example: "Engineering" },
            workPlaceType: {
              type: "string",
              enum: ["remote", "onsite", "hybrid"],
              example: "remote",
            },
            experience: { type: "string", example: "1-2 years" },
            jobDescription: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            img: {
              type: "string",
              nullable: true,
              example: "https://example.com/company-logo.jpg",
            },
            savedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-29T09:30:00.000Z",
            },
          },
        },
        SavedJobsListResponse: {
          type: "object",
          properties: {
            totalSavedJobs: { type: "number", example: 2 },
            savedJobs: {
              type: "array",
              items: { $ref: "#/components/schemas/SavedJobItem" },
            },
          },
        },
        AdminReviewUpdateRequest: {
          type: "object",
          required: ["adminReview"],
          properties: {
            adminReview: {
              type: "string",
              enum: ["pending", "reviewed", "risky"],
              example: "reviewed",
            },
          },
        },
        // ── Testimonial ──────────────────────────────────────────────
        Testimonial: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string", example: "Jane Doe" },
            rating: { type: "number", example: 5 },
            reviewmsg: {
              type: "string",
              example: "JobFit helped me find a job quickly and smoothly!",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2026-03-29T17:30:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        TestimonialRequest: {
          type: "object",
          required: ["username", "rating", "reviewmsg"],
          properties: {
            username: { type: "string", example: "Jane Doe" },
            rating: { type: "number", example: 5 },
            reviewmsg: {
              type: "string",
              example: "JobFit helped me find a job quickly and smoothly!",
            },
          },
        },
        // ── Candidate Profile ─────────────────────────────────────
        Profile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userName: { type: "string", example: "John Doe" },
            atsScore: { type: "number", example: 85 },
            description: {
              type: "string",
              example: "Aspiring software developer",
            },
            skills: { type: "array", items: { type: "string" } },
            education: { type: "array", items: { type: "object" } },
            experience: { type: "string", example: "0-2 years" },
            img: { type: "string", example: "https://example.com/profile.jpg" },
          },
        },

        // ── Recruiter Profile ─────────────────────────────────────
        RecruiterProfile: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            email: {
              type: "string",
              format: "email",
              example: "sample@company.com",
            },
            userName: { type: "string", example: "name" },
            img: {
              type: "string",
              example: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            },
            company: {
              type: "string",
              example: "Google Inc.",
            },
            position: {
              type: "string",
              example: "Lead Recruiter",
            },
            description: {
              type: "string",
              example: "Passionate about connecting talent with opportunity.",
            },
            location: {
              type: "string",
              example: "Mountain View, CA",
            },
            website: {
              type: "string",
              example: "https://careers.google.com",
            },
            linkedIn: {
              type: "string",
              example: "https://linkedin.com/in/username",
            },
            jobsPosted: { type: "number", example: 12 },
            candidatesHired: { type: "number", example: 5 },
            teamSize: { type: "number", example: 10 },
          },
        },
        RecruiterProfileRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", example: "jane@company.com" },
            userName: { type: "string", example: "janesmith" },
            company: { type: "string", example: "Google Inc." },
            position: { type: "string", example: "Lead Recruiter" },
            description: {
              type: "string",
              example: "Passionate about connecting talent with opportunity.",
            },
            location: { type: "string", example: "Mountain View, CA" },
            website: { type: "string", example: "https://careers.google.com" },
            linkedIn: {
              type: "string",
              example: "https://linkedin.com/in/username",
            },
            candidatesHired: { type: "number", example: 5 },
            teamSize: { type: "number", example: 10 },

          },
        },
        RecruiterProfileStats: {
          type: "object",
          properties: {
            jobsPosted: { type: "number", example: 12 },
            candidatesHired: { type: "number", example: 5 },
          },
        },
        // ── Generic ──────────────────────────────────────────────
        SuccessResponse: {
          type: "object",
          properties: {
            error: { type: "boolean", example: false },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "boolean", example: true },
            message: { type: "string", example: "Something went wrong" },
            data: { type: "object", nullable: true, example: null },
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
