import { Router } from "express";
import multer from "multer";
import {
  uploadDocument,
  listDocuments,
  removeDocument,
} from "./document.controller.js"; 
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { retrieveChunks } from "./document-retrieval/document-retrieval.controller.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.get(
  "/",
  authenticate,
  listDocuments
);

router.post(
  "/upload",
  authenticate,
  requireAdmin,
  upload.single("file"),
  uploadDocument
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  removeDocument
);

router.post(
  "/retrieve",
  authenticate,
  retrieveChunks
);


export default router;