import cloudinary from "../helper/cloudinary.js";
import userModel from "../model/userModel.js";
import adminModel from "../model/adminModel.js";
import bcrypt from "bcryptjs";
import streamifier from "streamifier";
import applyModel from "../model/applyCourse.js";
import applyACourse from "../model/applyInACourse.js";
import SendMessageModel from "../model/sendMsg.js";

const createUser = async (req, res) => {
  try {
    const {
      name,
      fathername,
      mothername,
      address,
      dob,
      dor,
      gender,
      mobile,
      password,
      role,
      branchName,
      branchCode,
      courseName,
      courseDuration,
      courseContent,
      highestQualification,
    } = req.body;

    const files = req.files || [];

    // ✅ Validate required fields
    if (
      !name ||
      !fathername ||
      !mothername ||
      !address ||
      !dob ||
      !dor ||
      !gender ||
      !mobile ||
      !password ||
      !role ||
      !branchName ||
      !branchCode ||
      !courseName ||
      !courseDuration ||
      !courseContent ||
      !highestQualification ||
      files.length === 0
    ) {
      return res.status(400).json({
        message: "All required fields and at least one image must be provided.",
      });
    }

    // ✅ Validate file size (must be less than 500 KB)
    const MAX_SIZE = 500 * 1024;
    const isValidSize = files.every((file) => file.size <= MAX_SIZE);

    if (!isValidSize) {
      return res.status(400).json({
        message: "The image file must be less than 500 KB.",
      });
    }

    // ✅ Ensure mobile not registered as Admin
    const existingAdmin = await adminModel.findOne({ mobile });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Mobile is already registered as an Admin" });
    }

    // ✅ Verify Admin Permissions
    const requestingAdmin = await adminModel.findById(req.userId);
    if (
      !requestingAdmin ||
      (requestingAdmin.role !== "super" &&
        requestingAdmin.role !== "branchAdmin")
    ) {
      return res.status(403).json({
        message:
          "Access denied, only super admin or branch admin can create student",
      });
    }

    if (
      requestingAdmin.role === "branchAdmin" &&
      requestingAdmin.branchName !== branchName
    ) {
      return res.status(403).json({
        message: "Branch Admin can only add students to their own branch",
      });
    }

    // ✅ Check if student with same mobile exists
    const existingStudent = await userModel.findOne({ mobile });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "User with this Phone number already exists",
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a strong password" });
    }

    // 🔹 Generate Student ID
    let userId;
    const lastStudent = await userModel
      .findOne({ role, branchCode })
      .sort({ createdAt: -1 });

    let newNumber = "001";
    if (lastStudent) {
      const lastUserId = lastStudent.userId;
      const match = lastUserId.match(/(\d+)$/);
      if (match) {
        const lastNumber = parseInt(match[0], 10);
        newNumber = String(lastNumber + 1).padStart(3, "0");
      }
    }
    userId = `RYIT/WB-${branchCode}/${newNumber}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Upload files to Cloudinary
    const uploadToCloudinary = (fileBuffer, fileName) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "students",
            public_id: `${fileName}_${Date.now()}`,
          },
          (error, result) => {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const cloudinaryImages = await Promise.all(
      files.map(async (file) => {
        const resultUrl = await uploadToCloudinary(
          file.buffer,
          file.originalname.split(".")[0]
        );
        return resultUrl;
      })
    );

    // ✅ Create student record
    const studentData = new userModel({
      userId,
      name,
      fathername,
      mothername,
      address,
      dob,
      dor,
      gender,
      mobile,
      password: hashedPassword,
      role,
      branchName,
      branchCode,
      courseName,
      courseDuration,
      courseContent,
      highestQualification,
      isVerified: true,
      image: cloudinaryImages[0],
    });

    await studentData.save();

    res
      .status(200)
      .json({ success: true, message: "Student registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

const calculateGrade = (marks) => {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "Fail";
};

const updateUser = async (req, res) => {
  try {
    const requestingAdmin = await adminModel.findById(req.userId);

    if (
      !requestingAdmin ||
      !["super", "branchAdmin"].includes(requestingAdmin.role)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { id } = req.params;
    const {
      name,
      fathername,
      mothername,
      address,
      dob,
      dor,
      gender,
      mobile,
      branchName,
      practical,
      theory,
      typingMarks,
      typingWPM,
      activeStatus,
      password,
    } = req.body;

    const files = req.files || [];

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Role-based branch restriction
    if (
      requestingAdmin.role === "branchAdmin" &&
      requestingAdmin.branchName !== user.branchName
    ) {
      return res
        .status(403)
        .json({ message: "Cannot update users from other branches." });
    }

    // Super admin changes branch — generate new userId
    if (
      requestingAdmin.role === "super" &&
      branchName &&
      branchName !== user.branchName
    ) {
      const lastStudent = await userModel
        .findOne({ role: user.role, branchName })
        .sort({ createdAt: -1 });

      let newNumber = "001";
      if (lastStudent) {
        const match = lastStudent.userId.match(/(\d+)$/);
        if (match) {
          const lastNumber = parseInt(match[0], 10);
          newNumber = String(lastNumber + 1).padStart(3, "0");
        }
      }

      user.userId = `RYIT/WB-${user.branchCode}/${newNumber}`;
      user.branchName = branchName;
    }

    // Upload image if provided
    if (files.length > 0) {
      const uploadToCloudinary = (fileBuffer, fileName) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "students",
              public_id: `${fileName}_${Date.now()}`,
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const cloudinaryImages = await Promise.all(
        files.map(async (file) => {
          const resultUrl = await uploadToCloudinary(
            file.buffer,
            file.originalname.split(".")[0]
          );
          return resultUrl;
        })
      );

      user.image = cloudinaryImages[0];
    }

    // Update password if provided
    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Calculate marks and grades
    const practicalMarks =
      practical !== undefined ? Number(practical) : user.practical || 0;
    const theoryMarks =
      theory !== undefined ? Number(theory) : user.theory || 0;
    const totalmarks = practicalMarks + theoryMarks;
    const grade = calculateGrade(totalmarks);

    const resolvedTypingMarks =
      typingMarks !== undefined ? Number(typingMarks) : user.typingMarks || 0;
    const typingGrade = calculateGrade(resolvedTypingMarks);
    const WPM =
      typingWPM !== undefined ? Number(typingWPM) : user.typingWPM || 0;

    // Assign all updates
    Object.assign(user, {
      name: name || user.name,
      fathername: fathername || user.fathername,
      mothername: mothername || user.mothername,
      address: address || user.address,
      dob: dob || user.dob,
      dor: dor || user.dor,
      gender: gender || user.gender,
      mobile: mobile || user.mobile,
      practical: practicalMarks,
      theory: theoryMarks,
      totalmarks,
      grade,
      typingMarks: resolvedTypingMarks,
      typingGrade,
      typingWPM: WPM,
      activeStatus:
        activeStatus !== undefined ? activeStatus : user.activeStatus,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCertificateDawnloadStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // 🧠 Update certificateDownloaded to true
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { certificateDownloaded: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate download status updated",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating certificate download status",
    });
  }
};

const applyCourse = async (req, res) => {
  const { name, mobile, email, center, course } = req.body;
  if (!name || !mobile || !center || !course) {
    return res
      .status(400)
      .json({ message: "name, mobile, center, course are required" });
  }

  let checkApply = await applyModel.findOne({ mobile });
  if (checkApply) {
    return res
      .status(400)
      .json({ success: false, message: "Already applied with this number" });
  }
  const applyData = new applyModel({
    name,
    mobile,
    email,
    center,
    course,
  });
  await applyData.save();
  return res
    .status(200)
    .json({ success: true, message: "Applied . We will contact you soon" });
};

const sendMsg = async (req, res) => {
  try {
    const { name, ph, email, msg } = req.body;
    if (!name || !ph || !msg) {
      return res.status(400).json({
        success: false,
        message: "name , phone & message are required",
      });
    }
    let checkPh = await SendMessageModel.findOne({ ph });
    if (checkPh) {
      return res
        .status(400)
        .json({ success: true, message: "Already applyed with thi phone no" });
    }
    const applyData = new SendMessageModel({
      name,
      ph,
      email,
      msg,
    });
    await applyData.save();
    return res
      .status(200)
      .json({ success: true, message: "We will contact you" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getNotificationData = async (req, res) => {
  try {
    // Fetch data counts from three models
    const applyDataCount = await applyModel.countDocuments();
    const applyCourseCount = await applyACourse.countDocuments();
    const sendMsgCount = await SendMessageModel.countDocuments();
    // Fetch data from three models
    const applyData = await applyModel.find();
    const applyCourse = await applyACourse.find();
    const sendMsg = await SendMessageModel.find();
    return res.status(200).json({
      success: true,
      data: {
        branchCourseCount: applyDataCount,
        totalCount: applyDataCount + applyCourseCount + sendMsgCount,
        applyData,
        applyCourse,
        sendMsg,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const { id, type } = req.params; // Get id and type from request params

    let deletedMessage;
    if (type === "applyData") {
      deletedMessage = await applyModel.findByIdAndDelete(id);
    } else if (type === "applyCourse") {
      deletedMessage = await applyACourse.findByIdAndDelete(id);
    } else if (type === "sendMsg") {
      deletedMessage = await SendMessageModel.findByIdAndDelete(id);
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const requestingAdmin = await adminModel.findById(req.userId);

    if (
      !requestingAdmin ||
      !["super", "branchAdmin"].includes(requestingAdmin.role)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      requestingAdmin.role === "branchAdmin" &&
      requestingAdmin.branchName !== user.branchName
    ) {
      return res
        .status(403)
        .json({ message: "Cannot delete users from other branches." });
    }

    await userModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const requestingAdmin = await adminModel.findById(req.userId);

    if (
      !requestingAdmin ||
      !["super", "branchAdmin"].includes(requestingAdmin.role)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    let filter = {};
    if (requestingAdmin.role === "branchAdmin") {
      filter.branchName = requestingAdmin.branchName;
    }

    const users = await userModel.find(filter);

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const applyInACourse = async (req, res) => {
  const { courseName, name, ph } = req.body;
  if (!courseName || !name || !ph) {
    res.status(400).json({ message: "All field are required" });
  }
  const existingph = await applyACourse.findOne({ ph });
  if (existingph) {
    return res.status(400).json({
      message: "With this mobile no already applied. We will contact you soon",
    });
  }
  const courseData = new applyACourse({
    courseName,
    name,
    ph,
  });
  await courseData.save();
  return res
    .status(200)
    .json({ success: true, message: "Applied, We will contact you soon" });
};

const getUserById = async (req, res) => {
  try {
    const requestingAdmin = await adminModel.findById(req.userId);

    if (
      !requestingAdmin ||
      !["super", "branchAdmin"].includes(requestingAdmin.role)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(404)
        .json({ message: "Registration number is required." });
    }
    const user = await userModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Restrict Branch Admin from generating users certificate outside their branch
    if (
      requestingAdmin.role === "branchAdmin" &&
      requestingAdmin.branchName !== user.branchName
    ) {
      return res
        .status(403)
        .json({ message: "Cannot generate certificate from other branches." });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserDetailsByIdPublic = async (req, res) => {
  const { userId } = req.params;
  const decodedUserId = decodeURIComponent(userId); // "RYIT/WB-B2534/002"
  // console.log(decodedUserId);

  const user = await userModel.findOne({ userId: decodedUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({ success: true, data: user });
};

export {
  createUser,
  applyCourse,
  updateUser,
  deleteUser,
  getAllUsers,
  applyInACourse,
  sendMsg,
  getNotificationData,
  deleteNotification,
  getUserById,
  getUserDetailsByIdPublic,
  updateCertificateDawnloadStatus,
};
