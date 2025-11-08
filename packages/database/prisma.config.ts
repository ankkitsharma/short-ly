import { defineConfig, env } from "prisma/config";
import {config} from "dotenv";

config();

// Use process.env.DATABASE_URL with fallback for Docker builds
// Prisma generation doesn't need a real DB connection, just a valid URL format
const databaseUrl = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/dbname";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});
