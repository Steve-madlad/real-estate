import z from "zod";

export const cognitoIdSchema = z.object({
  cognitoId: z.string().trim().min(1, "Cognito ID is required"),
});

export const favoritePropertySchema = z.object({
  cognitoId: z.uuid({
    message: "Invalid Cognito ID",
  }),
  propertyId: z.coerce
    .number()
    .int("Invalid property ID")
    .positive("Invalid property ID"),
});
