import { GoogleGenAI } from "@google/genai";
// isit necessary to create use gemini embedding, isn't is possible doing it manually and what exactly the process is there in embedding so we are using the gemini embedding api func.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateEmbedding = async (text: string) => {
    
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return response.embeddings?.[0]?.values;
};

