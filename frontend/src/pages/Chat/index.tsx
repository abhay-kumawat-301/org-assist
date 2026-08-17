import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askAssistant } from "@/api/assistant.api";
import { useAuth } from "@/auth/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your organization assistant. Ask me anything about your company documents.",
    },
  ]);

  const [question, setQuestion] = useState("");

  const sendMessage = async () => {
    if (!question.trim() || !token) return;

    const userQuestion = question;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const result = await askAssistant(
        userQuestion,
        token
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto flex max-w-4xl justify-center">
        <Card className="flex h-[80vh] w-full flex-col">
          <CardHeader>
            <CardTitle>
              OrgAssist AI Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-lg p-3 ${message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                {message.content}
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex gap-3">
            <Input
              placeholder="Ask something about your organization..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <Button
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Send"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default Chat;