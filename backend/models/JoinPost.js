
import mongoose from "mongoose";

const JoinPostSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coder",
    required: true
  },

  requiredSkills: [String],

  message: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const JoinPost = mongoose.model("JoinPost", JoinPostSchema);
