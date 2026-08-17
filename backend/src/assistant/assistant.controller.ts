import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { generateAnswer } from "./assistant.service.js";

export const askAssistant = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    if (!req.user?.organizationId) {
      return res.status(401).json({
        message: "Organization not found",
      });
    }

    const answer = await generateAnswer(
      question,
      req.user.organizationId
    );

    res.status(200).json({
      question,
      answer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate answer",
    });
  }
};