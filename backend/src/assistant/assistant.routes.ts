import { Router } from "express";
import { askAssistant } from "./assistant.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/ask",
  authenticate,
  askAssistant
);

export default router;