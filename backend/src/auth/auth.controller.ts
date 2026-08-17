import { Request, Response } from "express";
import { registerAdmin, loginUser } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { organizationName, organizationDescription, name, email, password } =
      req.body;

    if (!organizationName || !name || !email || !password) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const result = await registerAdmin({
      organizationName,
      organizationDescription,
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Organization and admin created successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};