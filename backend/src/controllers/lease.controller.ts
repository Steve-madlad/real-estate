import { prisma } from "../lib/db.js";
import { catchAsync } from "../lib/utils.js";
import type { Request, Response } from "express";

export const getLeases = catchAsync(async (_req: Request, res: Response) => {
  const leases = await prisma.lease.findMany({
    include: {
      tenant: true,
      property: true,
    },
  });

  return res.json({
    success: true,
    message: "Leases fetched successfully",
    data: leases,
  });
});

export const getLeasePayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payments = await prisma.payment.findMany({
    where: {
      leaseId: Number(userId)
    }
  });

  return res.json({
    success: true,
    message: "Payments fetched successfully",
    data: payments,
  });
});