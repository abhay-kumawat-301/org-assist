import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createEmployee,
  getEmployees,
} from "./employee.service.js";

export const addEmployee = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can create employees",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const employee = await createEmployee({
      organizationId: req.user.organizationId,
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to create employee",
    });
  }
};

export const listEmployees = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can view employees",
      });
    }

    const employees = await getEmployees(
      req.user.organizationId
    );

    res.status(200).json({
      employees,
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};