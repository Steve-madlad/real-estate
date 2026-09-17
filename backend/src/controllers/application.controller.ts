import type { Request, Response } from "express";
import { AppError } from "../lib/app-error.js";
import { prisma } from "../lib/db.js";
import { catchAsync } from "../lib/utils.js";

export const listApplications = catchAsync(
  async (req: Request, res: Response) => {
    const { id: userId, role } = req.user ?? {};

    let whereClause = {};

    if (userId && role) {
      if (role === "tenant") {
        whereClause = { tenantCognitoId: String(userId) };
      } else if (role === "manager") {
        whereClause = {
          property: { managerCognitoId: String(userId) },
        };
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
        tenant: true,
      },
    });

    function calculateNextPayment(startDate: Date): Date {
      const today = new Date();
      const nextPaymentDate = new Date(startDate);

      while (nextPaymentDate <= today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    }

    const formattedApplication = await Promise.all(
      applications.map(async (application) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: {
              cognitoId: application.tenantCognitoId,
            },
            propertyId: application.propertyId,
          },
          orderBy: {
            startDate: "desc",
          },
        });

        return {
          ...application,
          property: {
            ...application.property,
            address: application.property.location.address,
          },
          manager: application.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPayment(lease.startDate),
              }
            : null,
        };
      }),
    );

    res.json({
      success: true,
      data: formattedApplication,
    });
  },
);

export const createApplication = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { propertyId, name, email, phoneNumber, message } = req.body;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { pricePerMonth: true, securityDeposit: true },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    const newApplication = await prisma.$transaction(async (prisma) => {
      const lease = await prisma.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          rent: property.pricePerMonth,
          deposit: property.securityDeposit,
          property: {
            connect: { id: propertyId },
          },
          tenant: {
            connect: { cognitoId: userId },
          },
        },
      });

      const application = await prisma.application.create({
        data: {
          applicationDate: new Date(),
          status: "Pending",
          name,
          email,
          phoneNumber,
          message,
          property: {
            connect: { id: propertyId },
          },
          tenant: {
            connect: {
              cognitoId: userId,
            },
          },
          lease: {
            connect: {
              id: lease.id,
            },
          },
        },
        include: {
          property: true,
          tenant: true,
          lease: true,
        },
      });

      return application;
    });

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: newApplication,
    });
  },
);

export const processAplication = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        property: true,
        tenant: true,
      },
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    if (status === "Approved") {
      const newLease = await prisma.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          rent: application.property.pricePerMonth,
          deposit: application.property.securityDeposit,
          propertyId: application.propertyId,
          tenantCognitoId: application.tenantCognitoId,
        },
      });

      await prisma.property.update({
        where: { id: application.propertyId },
        data: {
          tenants: {
            connect: {
              cognitoId: application.tenantCognitoId,
            },
          },
        },
      });

      const updatedApplication = await prisma.application.update({
        where: { id: Number(id) },
        data: { status, leaseId: newLease.id },
        include: {
          property: true,
          tenant: true,
          lease: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Application approved successfully",
        data: updatedApplication,
      });
    } else {
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status },
      });

      return res.status(200).json({
        success: true,
        message: "Application denied successfully",
      });
    }
  },
);
