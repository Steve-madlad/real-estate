import z from "zod";

export const favoritePropertySchema = z.object({
  propertyId: z.coerce
    .number()
    .int("Invalid property ID")
    .positive("Invalid property ID"),
});
