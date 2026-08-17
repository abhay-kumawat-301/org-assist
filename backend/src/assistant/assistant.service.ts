import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantChunks } from "../documents/document-retrieval/document-retrieval.service.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAnswer = async (
  question: string,
  organizationId: number
) => {
  // 1. Retrieve relevant chunks
  const chunks = await retrieveRelevantChunks(
    question,
    organizationId,
    5
  );

  if (chunks.length === 0) {
    return "I couldn't find relevant information in the organization's documents.";
  }

  // 2. Build context from retrieved chunks
  const context = chunks
    .map((chunk:any, index:number
    ) => {
      return `Source ${index + 1}:\n${chunk.content}`;
    })
    .join("\n\n");

  // 3. Ask Gemini using only retrieved context
  const prompt = `
You are an AI assistant for an organization.

Answer the user's question using ONLY the information provided in the context below.

If the answer cannot be found in the context, say that you could not find the answer in the organization's documents.

Do not invent information.

Context:
${context}

User question:
${question}
`;

  // 4. Generate final answer
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
};