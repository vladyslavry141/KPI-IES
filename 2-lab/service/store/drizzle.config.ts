import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    //@ts-ignore
    connectionString: process.env.POSTGRES_CONNECTION_URL!,
  },
} satisfies Config;
