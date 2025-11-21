const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { NotFoundError, ValidationError } = require("../utils/errors");

class UserController {
  /**
   * Get all agents
   */
  static async getAllAgents(req, res, next) {
    try {
      const agents = await User.find({ role: "agent" })
        .select("_id username email role")
        .sort({ username: 1 });
      res.json(agents);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all users (admin)
   */
  static async getAllUsers(req, res, next) {
    try {
      const { role, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (role) filter.role = role;
      const skip = (Number(page) - 1) * Number(limit);
      const users = await User.find(filter)
        .select("_id username email role")
        .skip(skip)
        .limit(Number(limit));
      const total = await User.countDocuments(filter);
      res.json({ users, total });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a user (admin only)
   */
  static async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select(
        "_id username email role"
      );
      if (!user) return next(new NotFoundError("User"));

      await User.deleteOne({ _id: userId });

      // Log activity
      try {
        await ActivityLog.create({
          user: req.user?.id || req.user?._id,
          action: "DELETE",
          entityType: "User",
          entityId: user._id,
          changes: { deleted: true },
          metadata: { ip: req.ip },
        });
      } catch (e) {
        console.error("Failed to log user deletion", e);
      }

      res.json({ message: "User deleted successfully", user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get current user's profile
   */
  static async getProfile(req, res, next) {
    try {
      const userId = req.user?.id || req.user?._id;
      const user = await User.findById(userId).select(
        "_id username email role"
      );
      if (!user) return next(new NotFoundError("User"));
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update current user's profile
   */
  static async updateProfile(req, res, next) {
    try {
      const userId = req.user?.id || req.user?._id;
      const { username, email } = req.body;

      // Prevent changing role or password here
      const update = {};
      if (username) update.username = username.trim();
      if (email) update.email = String(email).trim().toLowerCase();

      // Check for duplicate username/email
      if (update.username) {
        const existing = await User.findOne({
          username: update.username,
          _id: { $ne: userId },
        });
        if (existing)
          return next(new ValidationError("Username already exists"));
      }
      if (update.email) {
        const existingEmail = await User.findOne({
          email: update.email,
          _id: { $ne: userId },
        });
        if (existingEmail)
          return next(new ValidationError("Email already exists"));
      }

      const user = await User.findByIdAndUpdate(userId, update, {
        new: true,
      }).select("_id username email role");
      if (!user) return next(new NotFoundError("User"));

      try {
        await ActivityLog.create({
          user: req.user?.id || req.user?._id,
          action: "UPDATE",
          entityType: "User",
          entityId: user._id,
          changes: update,
          metadata: { ip: req.ip },
        });
      } catch (e) {
        console.error("Failed to log profile update", e);
      }

      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change current user's password
   */
  static async changePassword(req, res, next) {
    try {
      const userId = req.user?.id || req.user?._id;
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) return next(new NotFoundError("User"));

      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) return next(new ValidationError("Old password is incorrect"));

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();

      try {
        await ActivityLog.create({
          user: req.user?.id || req.user?._id,
          action: "UPDATE",
          entityType: "User",
          entityId: user._id,
          changes: { password: true },
          metadata: { ip: req.ip },
        });
      } catch (e) {
        console.error("Failed to log password change", e);
      }

      res.json({ message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update user role (admin)
   */
  static async updateUserRole(req, res, next) {
    try {
      const userId = req.params.id;
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select("_id username role");
      if (!user) return next(new NotFoundError("User"));

      // Log activity
      try {
        await ActivityLog.create({
          user: req.user?.id || req.user?._id,
          action: "UPDATE",
          entityType: "User",
          entityId: user._id,
          changes: { role },
          metadata: { ip: req.ip },
        });
      } catch (e) {
        console.error("Failed to log user role change", e);
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
