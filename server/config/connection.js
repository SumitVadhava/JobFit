const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

const connectDB = () => {
  const mongoURI = process.env.MONGODB_URI;
  const dnsServers = process.env.MONGODB_DNS_SERVERS;

  if (!mongoURI) {
    console.error("MongoDB connection error: MONGODB_URI is not set");
    process.exit(1);
  }

  if (dnsServers) {
    const servers = dnsServers
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (servers.length > 0) {
      dns.setServers(servers);
      console.log(
        `Using custom DNS servers for MongoDB: ${servers.join(", ")}`,
      );
    }
  }

  mongoose
    .connect(
      mongoURI,
      {
        serverSelectionTimeoutMS: 10000,
      },
      // |{
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // }
    )
    .then(() => console.log("Database connected successfully"))
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected — retrying in 5s...");
    setTimeout(() => {
      mongoose
        .connect(mongoURI, { serverSelectionTimeoutMS: 10000 })
        .then(() => console.log("MongoDB reconnected successfully"))
        .catch((err) => console.error("MongoDB reconnect failed:", err.message));
    }, 5000);
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message || err);
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Database connection closed due to application termination");
    process.exit(0);
  });
};

module.exports = connectDB;
