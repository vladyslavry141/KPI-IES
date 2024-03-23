import fastifySwagger from "@fastify/swagger";
import fp from "fastify-plugin";

export default fp(
  async (fastify) => {
    await fastify.register(fastifySwagger, {
      prefix: "/documentation",
      swagger: {
        info: {
          title: "Processed Agent Data API",
          description: "API documentation for Processed Agent Data",
          version: "1.0.0",
        },
        externalDocs: {
          url: "https://swagger.io",
          description: "Find more info here",
        },
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
      },
    });
  },
  { name: "swagger" }
);
