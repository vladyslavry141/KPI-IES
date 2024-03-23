export const config = {
  mqtt: {
    url: process.env["MQTT_BROKER_URL"] as string,
    agentDataTopic: process.env["MQTT_AGENT_DATA_TOPIC"] as string,
  },
} as const;

console.dir({ env: process.env, config });
