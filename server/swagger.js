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
        // Use same-origin by default so Swagger "Try it out" works in local/dev/prod.
        url: process.env.SWAGGER_SERVER_URL || "http://localhost:5173/",
        description: "Current Server",
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
              enum: ["student", "faculty", "admin"],
              example: "student",
            },
            phone: { type: "string", example: "9876543210" },
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
            phone: { type: "string", example: "9876543210" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        // ── Job ──────────────────────────────────────────────────
        Job: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            title: { type: "string", example: "Software Engineer" },
            company: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Bangalore, India" },
            description: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            salary: { type: "string", example: "12-18 LPA" },
            type: {
              type: "string",
              enum: ["full-time", "part-time", "internship"],
              example: "full-time",
            },
            skills: {
              type: "array",
              items: { type: "string" },
              example: ["Node.js", "React"],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        JobRequest: {
          type: "object",
          required: ["title", "company", "location", "description"],
          properties: {
            title: { type: "string", example: "Software Engineer" },
            company: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Bangalore, India" },
            description: {
              type: "string",
              example: "Looking for a skilled SE...",
            },
            salary: { type: "string", example: "12-18 LPA" },
            type: {
              type: "string",
              enum: ["full-time", "part-time", "internship"],
              example: "full-time",
            },
            skills: {
              type: "array",
              items: { type: "string" },
              example: ["Node.js", "React"],
            },
          },
        },
        // ── Profile ──────────────────────────────────────────────
        Profile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userName: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            phone: { type: "string", example: "9876543210" },
            role: { type: "string", example: "student" },
            bio: { type: "string", example: "Aspiring software developer" },
            skills: { type: "array", items: { type: "string" } },
            education: { type: "array", items: { type: "object" } },
            experience: { type: "array", items: { type: "object" } },
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
