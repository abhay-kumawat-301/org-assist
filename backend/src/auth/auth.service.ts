import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database";

interface RegisterData {
  organizationName: string;
  organizationDescription?: string;
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}
export const registerAdmin = async (data: RegisterData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if email already exists
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [data.email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Email already registered");
    }

    // Create organization
    const organizationResult = await client.query(
      `INSERT INTO organizations (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description`,
      [data.organizationName, data.organizationDescription || null]
    );

    const organization = organizationResult.rows[0];

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create admin user
    const userResult = await client.query(
      `INSERT INTO users
       (organization_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, organization_id, name, email, role`,
      [
        organization.id,
        data.name,
        data.email,
        passwordHash,
        "ADMIN",
      ]
    );

    const user = userResult.rows[0];

    await client.query("COMMIT");

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        organizationId: user.organization_id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return {
      user,
      organization,
      token,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const loginUser = async (data: LoginData) => {
  const result = await pool.query(
    `SELECT id, organization_id, name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [data.email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      organizationId: user.organization_id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: {
      id: user.id,
      organizationId: user.organization_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};