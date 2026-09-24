import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import { PrismaClient } from "../../prisma/generated/client.js";

// Load AWS RDS Root Certificate
const rdsCa = fs.readFileSync("/root/certs/global-bundle.pem").toString();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // Strict validation against AWS CA
    ca: rdsCa,
  },
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });