import mqtt from "mqtt";
import { config } from "./config";
import { processAgentData } from "./service/AgentDataProcessor";

const main = async () => {
  const client = await mqtt.connectAsync(config.mqtt.url);
  console.log(config);

  await client.subscribeAsync(config.mqtt.agentDataTopic);

  client.on("message", async (_, payload) => {
    const agentData = JSON.parse(payload.toString());
    const edgeData = processAgentData(agentData);
    console.log({ agentData, edgeData });
    await client.publishAsync(
      config.mqtt.hubDataTopic,
      JSON.stringify(edgeData)
    );
  });
};

main().catch((err) => {
  throw err;
});
