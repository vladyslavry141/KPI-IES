import mqtt from "mqtt";
import path from "node:path";
import { Transform } from "stream";
import { config } from "./config";
import { AgentDataDataSource } from "./datasource/AgentDataDataSource";
import { fromAgentData } from "./mapper/AgentDataDtoMapper";

const buildPathToData = (filename: string) => {
  return path.resolve(path.join(__dirname, "../data/", filename));
};

const main = async () => {
  const agentDataStream = new AgentDataDataSource({
    accelerometer: buildPathToData("accelerometer.csv"),
    gps: buildPathToData("gps.csv"),
  });

  await agentDataStream.init();

  const client = await mqtt.connectAsync(config.mqtt.url);

  agentDataStream
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
          callback(null, JSON.stringify(fromAgentData(chunk)));
        },
      })
    )
    .on("data", (data) => {
      client.publish(config.mqtt.agentDataTopic, data);
    });
};

main().catch((err) => {
  throw err;
});
