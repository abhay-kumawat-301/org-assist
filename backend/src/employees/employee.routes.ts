import { Router } from "express";
import {
  addEmployee,
  listEmployees,
} from "./employee.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, addEmployee);
router.get("/", authenticate, listEmployees);

export default router;