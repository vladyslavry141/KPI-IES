import { RedisClientType, createClient } from "@redis/client";
import mqtt from "mqtt";
import { config } from "./config";
import { fromEdgeDataDto } from "./mapper/ProcessedAgentDataBaseMapper";
import { HubDataRedisStore } from "./service/HubDataRedisStore";
import { StoreApiClient } from "./service/StoreApiClient";

const main = async () => {
  console.log(config);
  const client = await mqtt.connectAsync(config.mqtt.url);
  const redisClient = createClient({ url: config.redis.url });

  await redisClient.connect();

  const hubDataRedisStore = new HubDataRedisStore(
    redisClient as RedisClientType,
    config.mqtt.hubDataTopic
  );

  const storeApiClient = new StoreApiClient(config.store.host);

  await client.subscribeAsync(config.mqtt.hubDataTopic);

  client.on("message", async (topic, payload) => {
    const data = JSON.parse(payload.toString());

    await hubDataRedisStore.add(data);
    const length = await hubDataRedisStore.count();

    if (length >= config.hub.batchSize) {
      const batch = await hubDataRedisStore.popMany(config.hub.batchSize);
      const processedEdgeDataBatch = batch.map((edgeData) =>
        fromEdgeDataDto(edgeData)
      );
      const res = await storeApiClient.createBatch(processedEdgeDataBatch);
      console.dir({ batch, processedEdgeDataBatch, res }, { depth: null });
    }
    console.log({ topic, payload: data, length });
  });
};

main().catch((err) => {
  throw err;
});
