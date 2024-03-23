import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import fp from "fastify-plugin";
import path, { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import * as schema from "./schema.js";

export interface DbPluginOptions {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp<DbPluginOptions>(
  async (fastify, opts) => {
    const migrateClient = postgres(fastify.config.db.connectionUrl, { max: 1 });
    await migrate(drizzle(migrateClient), {
      migrationsTable: "drizzle",
      migrationsFolder: resolve(join(__dirname, "../../../drizzle")),
    });

    const client = postgres(fastify.config.db.connectionUrl);

    const db = drizzle(client, { schema: schema });

    fastify.decorate("db", db);
  },
  { dependencies: ["config"] }
);

declare module "fastify" {
  export interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
  }
}
