import bcrypt from "bcrypt";
import pool from "../config/database.js";

interface CreateEmployeeData {
  organizationId: number;
  name: string;
  email: string;
  password: string;
}

export const createEmployee = async (data: CreateEmployeeData) => {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [data.email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await pool.query(
    `INSERT INTO users
      (organization_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'EMPLOYEE')
     RETURNING id, organization_id, name, email, role, created_at`,
    [
      data.organizationId,
      data.name,
      data.email,
      passwordHash,
    ]
  );

  return result.rows[0];
};

export const getEmployees = async (organizationId: number) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE organization_id = $1
       AND role = 'EMPLOYEE'
     ORDER BY created_at DESC`,
    [organizationId]
  );

  return result.rows;
};