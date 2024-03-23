export const config = {
  mqtt: {
    url: process.env["MQTT_BROKER_URL"]!,
    agentDataTopic: process.env["MQTT_AGENT_DATA_TOPIC"]!,
  },
  hub: {
    batchSize: Number.parseInt(process.env["HUB_BATCH_SIZE"]!),
  },
  redis: {
    url: process.env["REDIS_URL"]!,
  },
  store: {
    host: process.env["STORE_HOST"]!,
  },
} as const;
