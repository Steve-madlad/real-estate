import type { Request, Response } from "express";
import z from "zod";
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
    phoneNumber: z.string().min(1, "Phone number is required"),
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

  const parsed = createTenantSchema.safeParse({ cognitoId });
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
