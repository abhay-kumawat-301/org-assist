// document-ingestion.service.ts
import { extractPdfText } from "./document.parser.js";
import { chunkText } from "./document.chunker.js";
import { generateEmbedding } from "../ai/embedding.service.js";
import pool from "../config/database.js";

export async function processDocument(
    filePath: string,
    documentId: number
) {
    // 1. Parse document
    const text = await extractPdfText(filePath);

    // 2. Chunk text
    const chunks = chunkText(text);
    console.log("Total chunks:", chunks.length);
    // 3. Generate + store embeddings
    for (const chunk of chunks) {

        const embedding = await generateEmbedding(chunk);

        await pool.query(
            `
      INSERT INTO document_chunks
        (document_id, content, embedding)
      VALUES
        ($1, $2, $3::vector)
      `,
            [
                documentId,
                chunk,
                `[${embedding?.join(",")}]`,
            ]
        );
    }
    return {
        documentId,
        chunksProcessed: chunks.length,
    };
}