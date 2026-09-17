import type { Request, Response } from "express";
import type z from "zod";
import { prisma } from "../lib/db.js";
import handleValidationError, { catchAsync } from "../lib/utils.js";
import { PropertyIdSchema } from "../schemas/schema.js";

export const getPropertyLeases = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const parsed = PropertyIdSchema.safeParse({ propertyId: id });
    handleValidationError<z.infer<typeof PropertyIdSchema>>(parsed);

    const leases = await prisma.lease.findMany({
      where: {
        propertyId: parsed.data.propertyId,
        application: {
          status: "Approved",
        },
        ...(userRole === "manager"
          ? {
              property: {
                managerCognitoId: userId,
              },
            }
          : {
              tenant: {
                cognitoId: userId,
              },
            }),
      },
      include: {
        tenant: true,
        property: true,
      },
    });

    return res.json({
      success: true,
      message: "Property Leases fetched successfully",
      data: leases,
    });
  },
);

export const getLeasePayments = catchAsync(
  async (req: Request, res: Response) => {
    const { id: leaseId } = req.params;

    const payments = await prisma.payment.findMany({
      where: {
        leaseId: Number(leaseId),
      },
    });

    return res.json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });
  },
);
