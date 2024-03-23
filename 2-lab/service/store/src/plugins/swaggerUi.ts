import fastifySwaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp(
  async (fastify) => {
    await fastify.register(fastifySwaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      staticCSP: true,
      transformSpecificationClone: true,
    });
  },
  { dependencies: ["swagger"] }
);
