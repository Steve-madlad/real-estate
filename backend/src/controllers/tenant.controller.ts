import { wktToGeoJSON } from "@terraformer/wkt";
import type { Request, Response } from "express";
import z from "zod";
import { Prisma } from "../../prisma/generated/client.js";
import { AppError } from "../lib/app-error.js";
import { prisma } from "../lib/db.js";
import handleValidationError, { catchAsync } from "../lib/utils.js";
import { favoritePropertySchema } from "../schemas/schema.js";

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
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().optional(),
  })
  .strip();

export const getTenant = catchAsync(async (req: Request, res: Response) => {
  const { cognitoId } = req.params;

  const parsed = tenantSchema.safeParse({ cognitoId });
  handleValidationError<z.Infer<typeof tenantSchema>>(parsed);
  const { cognitoId: id } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { cognitoId: id },
    include: {
      favorites: true,
    },
  });

  if (tenant) {
    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } else {
    return res.status(404).json({
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
  handleValidationError<z.Infer<typeof createTenantSchema>>(parsed);

  const tenant = await prisma.tenant.create({
    data: parsed.data,
  });

  return res.status(201).json({
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
  handleValidationError<z.Infer<typeof updateTenantSchema>>(parsed);

  const tenant = await prisma.tenant.update({
    where: { cognitoId: parsed.data.cognitoId },
    data: parsed.data,
  });

  return res.status(200).json({
    success: true,
    message: "Tenant updated successfully",
    data: tenant,
  });
});

export const getCurrentresidences = catchAsync(
  async (req: Request, res: Response) => {
    const cognitoId = req.user?.id;

    const tenant = await prisma.tenant.findUnique({
      where: {
        cognitoId,
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const residences = await prisma.property.findMany({
      where: {
        tenants: { some: { cognitoId } },
      },
      include: {
        location: true,
      },
    });

    if (residences && residences.length > 0) {
      const residencesWithFormattedLocation = await Promise.all(
        residences.map(async (property) => {
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

      return res.json({
        success: true,
        message: "Residencies fetched successfuly",
        residences: residencesWithFormattedLocation,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  },
);

export const favoriteProperty = catchAsync(
  async (req: Request, res: Response) => {
    const cognitoId = req.user?.id;
    const { propertyId } = req.params;

    const parsed = favoritePropertySchema.safeParse({ propertyId });
    handleValidationError<z.infer<typeof favoritePropertySchema>>(parsed);
    const { propertyId: residenceId } = parsed.data;
    console.log("passed validation fam");

    const [tenant, property] = await Promise.all([
      prisma.tenant.findUnique({
        where: { cognitoId },
        select: {
          id: true,
          favorites: {
            where: { id: residenceId },
            select: { id: true },
          },
        },
      }),
      prisma.property.findUnique({
        where: { id: residenceId },
        select: { id: true },
      }),
    ]);

    if (!tenant || !property)
      throw new AppError(`${!tenant ? "Tenant" : "Property"} not found`, 404);

    if (tenant.favorites.length > 0)
      throw new AppError("Property already favorited", 409);

    try {
      await prisma.tenant.update({
        where: { cognitoId },
        data: { favorites: { connect: { id: residenceId } } },
      });

      return res.status(200).json({
        success: true,
        message: "Property favorited successfully",
        data: { propertyId: residenceId, isFavorited: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("Property already favorited", 409);
      }

      throw error;
    }
  },
);

export const unfavoriteProperty = catchAsync(
  async (req: Request, res: Response) => {
    const cognitoId = req.user?.id;
    const { propertyId } = req.params;

    const parsed = favoritePropertySchema.safeParse({ propertyId });
    handleValidationError<z.infer<typeof favoritePropertySchema>>(parsed);
    const { propertyId: residenceId } = parsed.data;

    const [tenant, property] = await Promise.all([
      prisma.tenant.findUnique({
        where: { cognitoId },
        select: {
          id: true,
          favorites: {
            where: { id: residenceId },
            select: { id: true },
          },
        },
      }),
      prisma.property.findUnique({
        where: { id: residenceId },
        select: { id: true },
      }),
    ]);

    if (!tenant || !property)
      throw new AppError(`${!tenant ? "Tenant" : "Property"} not found`, 404);

    if (tenant.favorites.length > 0) {
      await prisma.tenant.update({
        where: { cognitoId },
        data: { favorites: { disconnect: { id: residenceId } } },
      });

      return res.status(200).json({
        success: true,
        message: "Property unfavorited successfully",
        data: { propertyId: residenceId, isFavorited: false },
      });
    }

    throw new AppError("Property is not favorited", 409);
  },
);
