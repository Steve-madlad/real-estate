import { isValidPhoneNumber } from "libphonenumber-js";
import z from "zod";

export const PropertyIdSchema = z.object({
  propertyId: z.coerce
    .number()
    .int("Invalid property ID")
    .positive("Invalid property ID"),
});

export const managerSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
  })
  .strip();

export const createManagerSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
      .string()
      .default("")
      .refine(
        (value) => value === "" || /^\+?[1-9]\d{7,14}$/.test(value),
        "Invalid phone number",
      ),
  })
  .strip();

export const updateManagerSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().optional(),
    email: z.email("Invalid email address").optional(),
    phoneNumber: z
      .string()
      .default("")
      .refine(
        (value) => value === "" || isValidPhoneNumber(value, "ET"),
        "Invalid phone number",
      ),
  })
  .strip();

export const tenantSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
  })
  .strip();

export const createTenantSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string(),
  })
  .strip();

export const updateTenantSchema = z
  .object({
    cognitoId: z.string().min(1, "Cognito ID is required"),
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().optional(),
  })
  .strip();
