import { Router } from "express";
import { askAssistant } from "./assistant.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/ask",
  authenticate,
  askAssistant
);

export default router;