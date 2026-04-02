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

        // --- Jobs (Schema ready for future routes) ---
        Job: {
          type: "object",
          properties: {
            _id: { type: "string" },
            jobTitle: { type: "string", example: "Frontend Developer" },
            companyName: { type: "string", example: "TechCorp" },
            location: { type: "string", example: "Remote" },
            jobDescription: { type: "string", example: "Building modern UIs..." },
            openings: { type: "number", example: 2 },
          },
        },

        // --- Generic ---
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
