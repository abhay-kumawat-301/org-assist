// Semantic similarity search
import pool from "../../config/database";
import { generateEmbedding } from "../../ai/embedding.service";

export const retrieveRelevantChunks = async (
    question: string,
    organizationId: number,
    limit: number = 5
) => {
    // 1. Generate embedding for the user's question
    const embedding = await generateEmbedding(question);

    if (!embedding) {
        throw new Error("Failed to generate question embedding");
    }

    // 2. Search for the most similar chunks
    const result = await pool.query(
        `
    SELECT
      dc.id,
      dc.document_id,
      dc.content,
      dc.embedding <=> $1::vector AS distance
    FROM document_chunks dc
    JOIN documents d
      ON dc.document_id = d.id
    WHERE d.organization_id = $2
    ORDER BY dc.embedding <=> $1::vector
    LIMIT $3
    `,
        [
            `[${embedding.join(",")}]`,
            organizationId,
            limit,
        ]
    );

    return result.rows;
};