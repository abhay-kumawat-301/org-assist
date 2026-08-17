import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { retrieveRelevantChunks } from "./document-retrieval.service";

export const retrieveChunks = async (
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

    const chunks = await retrieveRelevantChunks(
      question,
      req.user.organizationId
    );

    res.status(200).json({
      question,
      chunks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve relevant chunks",
    });
  }
};