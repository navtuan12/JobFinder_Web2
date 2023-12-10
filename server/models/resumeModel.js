import mongoose, { Schema } from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    name:  { type: String, required: [true, "Name is required"] },
    email:  { type: String, required: [true, "Email is required"] },
    contact:  { type: Number, required: [true, "Contact is required"] },
    profileUrl: {type: String},
    about: {type: String}
  },
  { timestamps: true }
);

const Resumes = mongoose.model("Resumes", resumeSchema);

export default Resumes;