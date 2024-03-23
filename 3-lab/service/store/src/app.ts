import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // await fastify.register(fastifySwagger, {
  //   prefix: "/documentation",
  //   swagger: {
  //     info: {
  //       title: "Processed Agent Data API",
  //       description: "API documentation for Processed Agent Data",
  //       version: "1.0.0",
  //     },
  //     externalDocs: {
  //       url: "https://swagger.io",
  //       description: "Find more info here",
  //     },
  //     host: "127.0.0.1:3000",
  //     schemes: ["http"],
  //     consumes: ["application/json"],
  //     produces: ["application/json"],
  //   },
  // });

  // await fastify.register(fastifySwaggerUi, {
  //   routePrefix: "/documentation",
  //   uiConfig: {
  //     docExpansion: "full",
  //     deepLinking: false,
  //   },
  //   staticCSP: true,
  //   transformSpecificationClone: true,
  // });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
    forceESM: true,
  });
};

export default app;
export { app, options };
