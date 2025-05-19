import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // Unique user identifier
    name: { type: String, required: true },
    fathername: { type: String, required: true },
    mothername: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: String, required: true },
    dor: { type: String, required: true },
    gender: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    highestQualification: { type: String, required: true },
    image: { type: String, default: "" },
    password: { type: String }, // Password required for normal login (not for Google login)
    role: { type: String, required: true },
    branchName: { type: String, required: true },
    branchCode: { type: String, required: true },
    courseName: { type: String, required: true },
    courseDuration: { type: String, required: true },
    courseContent: { type: String, required: true },
    theory: { type: String },
    practical: { type: String },
    totalmarks: { type: String },
    grade: { type: String },
    typingWPM: { type: String },
    typingMarks: { type: String },
    typingGrade: { type: String },
    activeStatus: { type: Boolean, default: true },
    certificateDownloaded: {type: Boolean, default: false},
  },
  { timestamps: true }
);

const userModel = mongoose.models.Users || mongoose.model("Users", userSchema);

export default userModel;
