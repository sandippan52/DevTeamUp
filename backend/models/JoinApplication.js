

import mongoose from "mongoose";

const JoinApplicationSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JoinPost",
    required: true
  },

  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coder",
    required: true
  },

  selectedSkill: {
    type: String,
    required: true
  },

  message: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
   declineReason: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const JoinApplication = mongoose.model("JoinApplication", JoinApplicationSchema);
