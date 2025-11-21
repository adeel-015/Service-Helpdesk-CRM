const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "agent", "user"], default: "user" },
});
// Note: 'agent' role supported for ticket assignment

module.exports = mongoose.model("User", UserSchema);
