const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobFit API",
      version: "1.0.0",
      description:
        "REST API documentation for the JobFit platform — a job matching and resume analysis system built by Code Conquerors.",
      contact: {
        name: "Code Conquerors",
      },
        },
        servers: [
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
      {
        url: "https://jobfit-s5v7.onrender.com",
        description: "Render Server",
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
        // ── Auth ─────────────────────────────────────────────────
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
              enum: ['admin', 'user','recruiter', 'candidate'],
              example: "user",
            },
          },
        },
        GoogleLoginRequest: {
          type: "object",
          required: ["token"],
          properties: {
            token: { type: "string", example: "google-oauth2-token" },
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
            role: { type: "string", example: "student" },
          },
        },
        // ── Job ──────────────────────────────────────────────────
        Job: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            jobTitle: { type: "string", example: "Software Engineer" },
            department: { type: "string", example: "Engineering" },
            experience: { type: "string", example: "1-2 years" },
            responsibilities:{type: "string", example: "Develop and maintain software applications."},
            qualifications:{type: "string", example: "Bachelor's degree in Computer Science or related field."},
            companyName: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Bangalore, India" },
            workPlaceType: { type: "string", example: "Remote",enum: ['Remote', 'On-site', 'Hybrid'] },
            jobDescription: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            img: { type: "string", example: "https://example.com/company-logo.jpg" },
            bookmarked: { type: "boolean", example: false },
          },
        },
        JobRequest: {
          type: "object",
          required: ["title", "company", "location", "description"],
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            jobTitle: { type: "string", example: "Software Engineer" },
            department: { type: "string", example: "Engineering" },
            experience: { type: "string", example: "1-2 years" },
            responsibilities:{type: "string", example: "Develop and maintain software applications."},
            qualifications:{type: "string", example: "Bachelor's degree in Computer Science or related field."},
            companyName: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Bangalore, India" },
            workPlaceType: { type: "string", example: "Remote",enum: ['Remote', 'On-site', 'Hybrid'] },
            jobDescription: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            img: { type: "string", example: "https://example.com/company-logo.jpg" },
            bookmarked: { type: "boolean", example: false },
          },
        },
        // ── Profile ──────────────────────────────────────────────
        Profile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", example: "student" },
            description: { type: "string", example: "Aspiring software developer" },
            skills: { type: "array", items: { type: "string" } },
            education: { type: "array", items: { type: "object" } },
            experience: { type: "array", items: { type: "object" } },
            img: { type: "string", example: "https://example.com/profile.jpg" },
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
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
