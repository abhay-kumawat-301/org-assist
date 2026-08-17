export interface Document {
  id: number;
  organization_id: number;
  file_name: string;
  file_type: string;
  created_at: string;
}
export const uploadDocument = async (file: File, token: string) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    "http://localhost:5000/api/documents/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Upload failed");
  }

  return result;
};

export const getDocuments = async (token: string) => {
  const response = await fetch(
    "http://localhost:5000/api/documents",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch documents"
    );
  }

  return result.documents as Document[];
};

export const deleteDocument = async (
  id: number,
  token: string
) => {
  const response = await fetch(
    `http://localhost:5000/api/documents/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Delete failed");
  }

  return result;
};