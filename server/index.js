

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import { connectDB } from "./config/db.js";
// import router from "./routes/route.js";

// dotenv.config();

// const PORT = process.env.PORT || 3000;
// const app = express();
// const allowedOrigins = ["http://localhost:5173"];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// connectDB();

// // API endpoints
// app.use("/api/v1", router);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import router from "./routes/route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// Connect to DB
connectDB();

// API routes
app.use("/api/v1", router);

// ✅ Serve frontend
const frontendPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(frontendPath));

// ✅ Handle all other routes with React index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
