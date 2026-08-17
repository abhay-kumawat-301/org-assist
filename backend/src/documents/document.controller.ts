import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { processDocument } from "./document-ingestion.service";
import { saveDocument, getDocuments, deleteDocument } from "./document.service";
export const uploadDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can upload documents",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    // const text = await extractPdfText(req.file.path);

    // const chunks = chunkText(text);

    // console.log("Total chunks:", chunks.length);
    // console.log("First chunk:", chunks[0]);

    // const embedding = await generateEmbedding(chunks[0]);


    // console.log("Embedding length:", embedding?.length);
    // console.log("First 5 values:", embedding?.slice(0, 5));

    const document = await saveDocument({
      organizationId: req.user.organizationId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
    });
    await processDocument(
      req.file.path,
      document.id
    );
    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to upload document",
    });
  }
};
export const listDocuments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({
        message: "Organization not found",
      });
    }

    const documents = await getDocuments(
      req.user.organizationId
    );

    res.status(200).json({
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};
export const removeDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can delete documents",
      });
    }

    const documentId = Number(req.params.id);

    if (!documentId) {
      return res.status(400).json({
        message: "Invalid document id",
      });
    }

    const document = await deleteDocument(
      documentId,
      req.user.organizationId
    );

    res.status(200).json({
      message: "Document deleted successfully",
      document,
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Failed to delete document",
    });
  }
};