const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: {
    type: String,
    enum: ["CREATE", "UPDATE", "DELETE", "ASSIGN", "NOTIFY"],
    required: true,
  },
  entityType: { type: String, enum: ["Ticket", "User"], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  changes: { type: mongoose.Schema.Types.Mixed },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

ActivityLogSchema.index({ user: 1 });
ActivityLogSchema.index({ entityType: 1 });
ActivityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
