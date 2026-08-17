import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState, useRef } from "react";
import { uploadDocument, getDocuments, deleteDocument } from "@/api/document.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    getDocuments(token)
      .then(setDocuments)
      .catch((error) => {
        console.error(error);
      });
  }, [token]);
  const handleUpload = async () => {
    if (!file || !token) {
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const result = await uploadDocument(file, token);

      setMessage(result.message);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDocuments((previous) => [
        ...previous,
        result.document,
      ]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      await deleteDocument(id, token);

      setDocuments((previous) =>
        previous.filter((doc) => doc.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    // <main className="min-h-screen bg-muted/40 p-6">
    <main className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{documents.length}</p>

              <p className="text-sm text-muted-foreground">
                Knowledge base documents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>

            <CardContent>
              <Badge>Ready</Badge>

              <p className="mt-3 text-sm text-muted-foreground">
                Your organization assistant is active.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Upload PDF documents to add information to your
              organization's AI assistant.
            </p>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents uploaded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {document.file_name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {document.file_type}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(document.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setMessage("");
                  setError("");
                }}
              />

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </div>

            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}

            {message && (
              <p className="text-sm text-green-600">
                {message}
              </p>
            )}

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default AdminDashboard;