const API_URL = "http://localhost:5000/api/employees";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: "EMPLOYEE";
  created_at: string;
}

export const getEmployees = async (token: string) => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch employees");
  }

  return result.employees as Employee[];
};

export const createEmployee = async (
  data: {
    name: string;
    email: string;
    password: string;
  },
  token: string
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create employee");
  }

  return result.employee as Employee;
};