import { InferInsertModel, eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import { processedAgentData } from "../../plugins/db/schema.js";

const routes: FastifyPluginAsync = async function (instance, _) {
  instance.addSchema({
    $id: "processed-agent-data/base",
    type: "object",
    properties: {
      roadState: { type: "string" },
      x: { type: "integer" },
      y: { type: "integer" },
      z: { type: "integer" },
      latitude: { type: "number" },
      longitude: { type: "number" },
    },
    additionalProperties: false,
    required: ["roadState", "x", "y", "z", "latitude", "longitude"],
  });

  instance.addSchema({
    $id: "processed-agent-data",
    allOf: [{ $ref: "processed-agent-data/base#" }],
    type: "object",
    properties: {
      id: { type: "integer" },
    },
    required: ["id"],
  });

  instance.get<{ Params: { id: number } }>(
    "/:id",
    {
      schema: {
        description: "Get a processed agent data entry by id",
        tags: ["processed-agent-data"],
        summary: "Get a data entry by id",
        params: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              data: {
                type: "object",
                $ref: "processed-agent-data#",
              },
            },
          },
        },
      },
    },
    async function (req, reply): Promise<void> {
      req.log.info(req.params);
      const data = await instance.db.query.processedAgentData.findFirst({
        where: eq(processedAgentData.id, req.params.id),
      });

      if (!data) {
        return await reply.code(404).send({});
      }

      await reply.code(200).send({ data });
    }
  );

  instance.get(
    "/",
    {
      schema: {
        description: "Get all processed agent data entries",
        tags: ["processed-agent-data"],
        summary: "Get all data entries",
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "processed-agent-data#",
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply): Promise<void> {
      const data = await instance.db.query.processedAgentData.findMany();

      if (!data.length) {
        await reply.code(404).send({});
      }

      await reply.code(200).send({ data });
    }
  );

  instance.post<{ Body: InferInsertModel<typeof processedAgentData> }>(
    "/",
    {
      schema: {
        description: "Creates a new processed agent data entry",
        tags: ["processed_agent_data"],
        summary: "Create new data entry",
        body: {
          $ref: "processed-agent-data/base#",
        },
        response: {
          201: {
            description: "Successful response",
            type: "object",
            properties: {
              data: {
                $ref: "processed-agent-data#",
              },
            },
          },
        },
      },
    },
    async function (req, reply): Promise<void> {
      const [data] = await instance.db
        .insert(processedAgentData)
        .values(req.body)
        .returning();

      await reply.code(201).send({ data });
    }
  );

  instance.post<{
    Body: { batch: InferInsertModel<typeof processedAgentData>[] };
  }>(
    "/batch",
    {
      schema: {
        description: "Creates a new processed agent data entries batch",
        tags: ["processed_agent_data"],
        summary: "Create new data entries batch",
        body: {
          type: "object",
          properties: {
            batch: {
              type: "array",
              items: {
                $ref: "processed-agent-data/base#",
              },
            },
          },
          required: ["batch"],
        },
        response: {
          201: {
            description: "Successful response",
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "processed-agent-data#",
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply): Promise<void> {
      const data = await instance.db
        .insert(processedAgentData)
        .values(req.body.batch)
        .returning();

      await reply.code(201).send({ data });
    }
  );

  instance.patch<{
    Params: { id: number };
    Body: InferInsertModel<typeof processedAgentData>;
  }>(
    "/:id",
    {
      schema: {
        description: "Updates a new processed agent data entry",
        tags: ["processed_agent_data"],
        summary: "Update data entry",
        params: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
          },
          required: ["id"],
        },
        body: {
          $ref: "processed-agent-data/base#",
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              data: {
                $ref: "processed-agent-data#",
              },
            },
          },
        },
      },
    },
    async function (req, reply): Promise<void> {
      const [data] = await instance.db
        .update(processedAgentData)
        .set(req.body)
        .where(eq(processedAgentData.id, req.params.id))
        .returning();

      await reply.code(200).send({ data });
    }
  );

  instance.delete<{ Params: { id: number } }>(
    "/:id",
    {
      schema: {
        description: "Deletes a processed agent data entry by id",
        tags: ["processed_agent_data"],
        summary: "Delete data entry by id",
        params: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {},
          },
        },
      },
    },
    async function (req, reply): Promise<void> {
      await instance.db
        .delete(processedAgentData)
        .where(eq(processedAgentData.id, req.params.id));

      await reply.code(200).send({});
    }
  );
};

export default routes;
