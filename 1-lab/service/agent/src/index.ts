import mqtt from "mqtt";
import path from "node:path";
import { Transform } from "stream";
import { config } from "./config";
import { AggregatedDataDataSource } from "./datasource/AggregatedDataDataSource";
import { ParkingDataSource } from "./datasource/ParkingDataSource";
import { fromAggregatedData } from "./mapper/AggregatedDataDtoMapper";
import { fromParking } from "./mapper/ParkingDtoMapper";

const buildPathToData = (filename: string) => {
  return path.resolve(path.join(__dirname, "../data/", filename));
};

const main = async () => {
  const aggregatedDataStream = new AggregatedDataDataSource({
    accelerometer: buildPathToData("accelerometer.csv"),
    gps: buildPathToData("gps.csv"),
  });

  await aggregatedDataStream.init();

  const parkingDataStream = new ParkingDataSource({
    parking: buildPathToData("parking.csv"),
  });

  await parkingDataStream.init();

  const client = await mqtt.connectAsync(config.mqtt.url);

  aggregatedDataStream
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
          callback(null, JSON.stringify(fromAggregatedData(chunk)));
        },
      })
    )
    .on("data", (data) => {
      client.publish(config.mqtt.aggregatedDataTopic, data);
    });

  parkingDataStream
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
          callback(null, JSON.stringify(fromParking(chunk)));
        },
      })
    )
    .on("data", (data) => {
      client.publish(config.mqtt.parkingTopic, data);
    });
};

main().catch((err) => {
  throw err;
});
