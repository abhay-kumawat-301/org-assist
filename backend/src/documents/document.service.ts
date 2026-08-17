import pool from "../config/database.js";

interface SaveDocumentData {
  organizationId: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

export const saveDocument = async (data: SaveDocumentData) => {
  const result = await pool.query(
    `INSERT INTO documents
      (organization_id, file_name, file_type, file_path)
     VALUES ($1, $2, $3, $4)
     RETURNING id, organization_id, file_name, file_type, file_path, created_at`,
    [
      data.organizationId,
      data.fileName,
      data.fileType,
      data.filePath,
    ]
  );

  return result.rows[0];
};
export const getDocuments = async (organizationId: number) => {
  const result = await pool.query(
    `SELECT id, organization_id, file_name, file_type, created_at
     FROM documents
     WHERE organization_id = $1
     ORDER BY created_at DESC`,
    [organizationId]
  );

  return result.rows;
};
export const deleteDocument = async (
  documentId: number,
  organizationId: number
) => {
  const result = await pool.query(
    `DELETE FROM documents
     WHERE id = $1
       AND organization_id = $2
     RETURNING id, file_name`,
    [
      documentId,
      organizationId,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Document not found");
  }

  return result.rows[0];
};