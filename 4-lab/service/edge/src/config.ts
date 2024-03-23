export const config = {
  mqtt: {
    url: process.env["MQTT_BROKER_URL"]!,
    hubDataTopic: process.env["MQTT_HUB_DATA_TOPIC"]!,
    agentDataTopic: process.env["MQTT_AGENT_DATA_TOPIC"]!,
  },
} as const;
