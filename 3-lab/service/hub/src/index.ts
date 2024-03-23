import { RedisClientType, createClient } from "@redis/client";
import mqtt from "mqtt";
import { config } from "./config";
import { fromAgentDataDto } from "./mapper/ProcessedAgentDataBaseMapper";
import { AgentDataRedisStore } from "./service/AgentDataRedisStore";
import { StoreApiClient } from "./service/StoreApiClient";

const main = async () => {
  console.log(config);
  const client = await mqtt.connectAsync(config.mqtt.url);
  const redisClient = createClient({ url: config.redis.url });

  await redisClient.connect();

  const agentDataRedisStore = new AgentDataRedisStore(
    redisClient as RedisClientType,
    config.mqtt.agentDataTopic
  );

  const storeApiClient = new StoreApiClient(config.store.host);

  await client.subscribeAsync(config.mqtt.agentDataTopic);

  client.on("message", async (topic, payload) => {
    const data = JSON.parse(payload.toString());

    await agentDataRedisStore.add(data);
    const length = await agentDataRedisStore.count();

    if (length >= config.hub.batchSize) {
      const batch = await agentDataRedisStore.popMany(config.hub.batchSize);
      const processedAgentDataBatch = batch.map((agentData) =>
        fromAgentDataDto(agentData, "OK")
      );
      const res = await storeApiClient.createBatch(processedAgentDataBatch);
      console.log({ batch, processedAgentDataBatch, res });
    }
    console.log({ topic, payload: data, length });
  });
};

main().catch((err) => {
  throw err;
});
