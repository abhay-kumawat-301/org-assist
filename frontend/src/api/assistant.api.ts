export const askAssistant = async (
  question: string,
  token: string
) => {
  const response = await fetch(
    "http://localhost:5000/api/assistant/ask",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get answer");
  }

  return result;
};