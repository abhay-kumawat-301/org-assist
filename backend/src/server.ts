import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import authRoutes from "./auth/auth.routes";
import employeeRoutes from "./employees/employee.routes";
import {
  authenticate,
  AuthRequest,
} from "./middleware/auth.middleware";
import assistantRoutes from "./assistant/assistant.routes";
import documentRoutes from "./documents/document.routes";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/assistant", assistantRoutes);
//Hello World
app.get("/", (req, res) => {
  res.json({
    message: "OrgAssist backend is running 🚀",
  });
});
//Json Response
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "OK",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERROR",
      database: "Not connected",
    });
  }
});
//Jwt Token working.
app.get("/api/protected", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});