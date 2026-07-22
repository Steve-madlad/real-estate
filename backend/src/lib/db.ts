import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
// Import from the custom output directory you configured in your schema
import { PrismaClient } from "../../prisma/generated/client.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter directly into the new PrismaClient instance
export const prisma = new PrismaClient({ adapter });
