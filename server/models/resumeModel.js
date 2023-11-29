import mongoose, { Schema } from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    name: {type: String},
    email: {type: String},
    contact: {type: Number},
    profileUrl: {type: String},
    about: {type: String}
  },
  { timestamps: true }
);

const Resumes = mongoose.model("Resumes", resumeSchema);

export default Resumes;