import fp from "fastify-plugin";

export interface EnvConfig {
  db: {
    connectionUrl: string;
  };
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<{}>(
  async (fastify, opts) => {
    const config = {
      db: {
        connectionUrl: process.env["POSTGRES_CONNECTION_URL"]!,
      },
    } as const;

    fastify.decorate("config", config);
  },
  { name: "config" }
);

declare module "fastify" {
  export interface FastifyInstance {
    config: EnvConfig;
  }
}
