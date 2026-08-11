import { wktToGeoJSON } from "@terraformer/wkt";
import type { Request, Response } from "express";
import z from "zod";
import { AppError } from "../lib/app-error.js";
import { prisma } from "../lib/db.js";
import handleValidationError, { catchAsync } from "../lib/utils.js";
import { cognitoIdSchema } from "../schemas/schema.js";

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

const updateManagerSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().optional(),
    email: z.email("Invalid email address").optional(),
    phoneNumber: z.string().optional(),
  })
  .strip();

export const getManager = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;

  const parsed = managerSchema.safeParse({ cognitoId });
  handleValidationError<z.Infer<typeof managerSchema>>(parsed, res);
  const { cognitoId: id } = parsed.data;

  const manager = await prisma.manager.findUnique({
    where: { cognitoId: id },
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

  const parsed = createManagerSchema.safeParse({
    cognitoId,
    name,
    email,
    phoneNumber,
  });
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

export const updateManager = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;
  const { name, email, phoneNumber } = req.body;

  const parsed = updateManagerSchema.safeParse({
    cognitoId,
    name,
    email,
    phoneNumber,
  });
  handleValidationError<z.Infer<typeof updateManagerSchema>>(parsed, res);

  if (!parsed.data.name && !parsed.data.email && !parsed.data.phoneNumber) {
    throw new AppError("At least one field must be updated", 400);
  }

  const manager = await prisma.manager.update({
    where: { cognitoId: parsed.data.cognitoId },
    data: parsed.data,
  });

  res.status(200).json({
    success: true,
    message: "Manager updated successfully",
    data: manager,
  });
});

export const getManagerProperties = catchAsync(
  async (req: Request, res: Response) => {
    const { cognitoId } = req.params;

    const parsed = cognitoIdSchema.safeParse({ cognitoId });
    handleValidationError<z.infer<typeof cognitoIdSchema>>(parsed, res);
    const { cognitoId: id } = parsed.data;

    const manager = await prisma.manager.findUnique({
      where: {
        cognitoId: id,
      },
    });

    if (!manager) {
      res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    const properties = await prisma.property.findMany({
      where: {
        managerCognitoId: id,
      },
      include: {
        location: true,
      },
    });

    if (properties) {
      const propertiesWithFormattedLocation = await Promise.all(
        properties.map(async (property) => {
          const coordinates: { coordinates: string }[] =
            await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

          const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
          const longitude = geoJSON.coordinates[0];
          const latitude = geoJSON.coordinates[1];

          return {
            ...property,
            location: {
              ...property.location,
              coordinates: {
                longitude,
                latitude,
              },
            },
          };
        }),
      );

      res.json({success: true, properties: propertiesWithFormattedLocation});
      return;
    }

    res.status(404).json({
      success: false,
      message: "Property not found",
    });
  },
);
