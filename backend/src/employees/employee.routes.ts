import { Router } from "express";
import {
  addEmployee,
  listEmployees,
} from "./employee.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, addEmployee);
router.get("/", authenticate, listEmployees);

export default router;