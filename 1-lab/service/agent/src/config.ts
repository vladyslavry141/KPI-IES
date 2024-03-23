export const config = {
  mqtt: {
    url: process.env["MQTT_BROKER_URL"] as string,
    aggregatedDataTopic: process.env["MQTT_AGGREGATED_DATA_TOPIC"] as string,
    parkingTopic: process.env["MQTT_PARKING_TOPIC"] as string,
  },
} as const;

console.dir({ env: process.env, config });
