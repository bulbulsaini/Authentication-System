import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first");
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // 5173 = Vite default port
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (_req, res) => res.json({ message: "Auth API is running ✅" }));

// Connect to MongoDB then start server
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
