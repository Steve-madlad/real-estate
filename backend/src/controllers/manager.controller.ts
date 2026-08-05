import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/db.js";
import handleValidationError, { catchAsync } from "../lib/utils.js";

const managerSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
  })
  .strip();

const createManagerSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  })
  .strip();

export const getManager = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;

  const parsed = managerSchema.safeParse({ cognitoId });
  handleValidationError<z.Infer<typeof managerSchema>>(parsed, res);
  const { cognitoId: id } = parsed.data;

  const manager = await prisma.manager.findUnique({
    where: { cognitoId: id }
  });

  if (manager) {
    res.status(200).json({
      success: true,
      data: manager,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Manager not found",
    });
  }
});

export const createManager = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId, name, email, phoneNumber } = req.body;

  const parsed = createManagerSchema.safeParse({ cognitoId, name, email, phoneNumber });
  handleValidationError<z.Infer<typeof createManagerSchema>>(parsed, res);

  const manager = await prisma.manager.create({
    data: parsed.data,
  });

  res.status(201).json({
    success: true,
    message: "Manager created successfully",
    data: manager,
  });
});
