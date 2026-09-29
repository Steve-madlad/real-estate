import mime from "mime-types";
import fs from "node:fs/promises";
import path from "node:path";
import properties from "../data/seedData/property.json" with { type: "json" };

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import type { Amenity, Highlight, Location, PropertyType } from "../../prisma/generated/client.js";
import { prisma } from "../lib/db.js";
import { uuid } from "zod";
import { randomUUID } from "node:crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const IMAGES_DIR = path.resolve("./src/data/seedData/images");
const MANAGER_COGNITO_ID = "904c294c-7031-70fc-5ae7-5678d1af3320";

async function uploadImage(imagePath: string): Promise<string> {
  const filePath = path.join(IMAGES_DIR, imagePath);

  const buffer = await fs.readFile(filePath);

  const filename = path.basename(imagePath);
  const contentType = mime.lookup(filename) || "application/octet-stream";

  const key = `properties/${Date.now()}-${filename}`;

  const uploadResult = await new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    },
  }).done();

  if (!uploadResult.Location) {
    throw new Error(`S3 upload failed for ${imagePath}`);
  }

  return uploadResult.Location;
}

async function main() {
  for (const property of properties) {
    console.log(`Creating property: ${property.name}`);

    // Upload all property images
    const photoUrls = await Promise.all(
      property.photoUrls.map((image) => uploadImage(image)),
    );

    const { address, city, state, country, postalCode, coordinates } =
      property.locationDetails;

    const [longitude, latitude] = coordinates;

    // Create PostGIS location
    const [location] = await prisma.$queryRaw<Location[]>`
              INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
              VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
              RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
            `;

    if (!location) {
      throw new Error(
        `Failed to create location for property: ${property.name}`,
      );
    }

    // Remove fields that don't belong directly on Property
    const { locationDetails: _locationDetails, id: _id, ...propertyData } = property;

    await prisma.property.create({
      data: {
        id: Number(randomUUID().replace(/\D/g, "").slice(0, 6)),

        ...propertyData,

        photoUrls,

        locationId: location.id,

        managerCognitoId: MANAGER_COGNITO_ID,

        amenities: propertyData.amenities as Amenity[],

        highlights: propertyData.highlights as Highlight[],

        isPetsAllowed: propertyData.isPetsAllowed,

        isParkingIncluded: propertyData.isParkingIncluded,

        propertyType: propertyData.propertyType as PropertyType,

        pricePerMonth: Number(propertyData.pricePerMonth),

        securityDeposit: Number(propertyData.securityDeposit),

        applicationFee: Number(propertyData.applicationFee),

        beds: Number(propertyData.beds),

        baths: Number(propertyData.baths),

        squareFeet: Number(propertyData.squareFeet),
      },
    });

    console.log(`✓ Created: ${property.name}`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
