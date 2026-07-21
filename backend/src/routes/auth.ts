import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Helper: generate a JWT token for a user id
const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "7d" });

// ─── SIGN UP ─────────────────────────────────────────────
// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    // Hash the password (never store plain text passwords!)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save user to MongoDB
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Account created successfully!",
      token: generateToken(user._id.toString()),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ─── LOG IN ──────────────────────────────────────────────
// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    res.json({
      message: "Login successful!",
      token: generateToken(user._id.toString()),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ─── FORGOT PASSWORD ─────────────────────────────────────
// POST /api/auth/forgot-password
// Body: { email }
// Always responds with the same generic message, whether or not the
// email is registered — this stops the endpoint being used to check
// which emails exist in the system.
router.post("/forgot-password", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const GENERIC_MESSAGE = "If an account with that email exists, a reset link has been sent.";

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Generate a random token and store it with a 1-hour expiry
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // TODO: replace this with a real email send (e.g. Nodemailer/SendGrid).
      // For now, the link is logged so you can test the flow without email setup.
      const resetLink = `http://localhost:5173/reset-password/${token}`;
      console.log(`🔑 Password reset link for ${email}: ${resetLink}`);
    }

    res.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ─── RESET PASSWORD ──────────────────────────────────────
// POST /api/auth/reset-password
// Body: { token, password }
router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: "Token and new password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    // Find a user with this exact token that hasn't expired yet.
    // resetPasswordToken/Expires have select:false on the schema, so they
    // must be requested explicitly with .select() here.
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset link" });
      return;
    }

    // Set the new password and clear the reset fields so the token
    // can't be reused.
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ─── GET PROFILE (protected route example) ───────────────
// GET /api/auth/me  →  needs Authorization: Bearer <token> header
router.get("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password"); // exclude password
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;