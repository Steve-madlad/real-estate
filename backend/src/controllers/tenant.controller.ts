import type { Request, Response } from "express";
import z from "zod";
import { AppError } from "../lib/app-error.js";
import { prisma } from "../lib/db.js";
import handleValidationError, { catchAsync } from "../lib/utils.js";

const tenantSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
  })
  .strip();

const createTenantSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string(),
  })
  .strip();

const updateTenantSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().optional(),
    email: z.email("Invalid email address").optional(),
    phoneNumber: z.string().optional(),
  })
  .strip();

export const getTenant = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;

  const parsed = tenantSchema.safeParse({ cognitoId });
  handleValidationError<z.Infer<typeof tenantSchema>>(parsed, res);
  const { cognitoId: id } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { cognitoId: id },
    include: {
      favorites: true,
    },
  });

  if (tenant) {
    res.status(200).json({
      success: true,
      data: tenant,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Tenant not found",
    });
  }
});

export const createTenant = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId, name, email, phoneNumber } = req.body;

  const parsed = createTenantSchema.safeParse({
    cognitoId,
    name,
    email,
    phoneNumber,
  });
  handleValidationError<z.Infer<typeof createTenantSchema>>(parsed, res);

  const tenant = await prisma.tenant.create({
    data: parsed.data,
  });

  res.status(201).json({
    success: true,
    message: "Tenant created successfully",
    data: tenant,
  });
});

export const updateTenant = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;
  const { name, email, phoneNumber } = req.body;

  const parsed = updateTenantSchema.safeParse({
    cognitoId,
    name,
    email,
    phoneNumber,
  });
  handleValidationError<z.Infer<typeof updateTenantSchema>>(parsed, res);

  if (!parsed.data.name && !parsed.data.email && !parsed.data.phoneNumber) {
    throw new AppError("At least one field must be updated", 400);
  }

  const tenant = await prisma.tenant.update({
    where: { cognitoId: parsed.data.cognitoId },
    data: parsed.data,
  });

  res.status(200).json({
    success: true,
    message: "Tenant updated successfully",
    data: tenant,
  });
});
