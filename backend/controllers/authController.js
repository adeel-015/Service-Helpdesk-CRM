const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");

class AuthController {
  /**
   * Register a new user
   */
  static async register(req, res, next) {
    try {
      const { username, password, role, email } = req.body;

      // Validation is handled by middleware; check duplicate username
      const existing = await User.findOne({ username });
      if (existing) return next(new ValidationError("Username already exists"));

      // Check duplicate email
      const existingEmail = await User.findOne({ email });
      if (existingEmail)
        return next(new ValidationError("Email already exists"));

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username: username.trim(),
        email: email && String(email).trim().toLowerCase(),
        password: hashedPassword,
        role,
      });
      await user.save();
      // Return created user info (without password)
      res.json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login user and return JWT
   */
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return next(new NotFoundError("User"));

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return next(new UnauthorizedError("Invalid credentials"));

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token, username: user.username, role: user.role });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
