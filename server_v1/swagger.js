const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobFit API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive REST API documentation for the JobFit platform — a job matching and resume analysis system built by Code Conquerors.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
      {
        url: "https://jobfit-s5v7.onrender.com",
        description: "Production Server",
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

        // --- Applications ---
        Application: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            jobId: { $ref: '#/components/schemas/Job' },
            candidateId: { $ref: '#/components/schemas/User' },
            status: { type: "string", enum: ["applied", "shortlisted", "hired", "rejected"], example: "applied" },
            appliedAt: { type: "string", format: "date-time" },
            hiredAt: { type: "string", format: "date-time", nullable: true },
          },
        },

        // --- Generic Responses ---
        SuccessResponse: {
          type: "object",
          properties: {
            error: { type: "boolean", example: false },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object", nullable: true, example: null },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "boolean", example: true },
            message: { type: "string", example: "Something went wrong" },
            details: { type: "string", nullable: true, example: null },
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
