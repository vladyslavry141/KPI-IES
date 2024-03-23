import { CsvParserStream, parseFile } from "fast-csv";
import { Readable } from "node:stream";
import { Accelerometer } from "src/domain/Accelerometer";
import { Gps } from "src/domain/Gps";

type CsvGps = Record<keyof Gps, string>;
type CsvAccelerometer = Record<keyof Accelerometer, string>;
// type CsvParking = Record<keyof Gps | "empty_count", string>;

const gpsParser = (csvGps: CsvGps): Gps => ({
  latitude: Number.parseFloat(csvGps.latitude),
  longitude: Number.parseFloat(csvGps.longitude),
});

const accelerometerParser = (
  csvAccelerometer: CsvAccelerometer
): Accelerometer => ({
  x: Number.parseFloat(csvAccelerometer.x),
  y: Number.parseFloat(csvAccelerometer.y),
  z: Number.parseFloat(csvAccelerometer.z),
});

export class AgentDataDataSource extends Readable {
  private aggregatedDataStreamInterval: NodeJS.Timeout | null = null;
  private gpsStream: CsvParserStream<CsvGps, Gps>;
  private accelerometerStream: CsvParserStream<CsvAccelerometer, Accelerometer>;
  private gpsData = new Array<Gps>();
  private accelerometerData = new Array<Accelerometer>();

  constructor(dataFilepath: { accelerometer: string; gps: string }) {
    super({ objectMode: true });

    this.gpsStream = parseFile<CsvGps, Gps>(dataFilepath.gps, {
      headers: true,
    }).transform(gpsParser);

    this.accelerometerStream = parseFile<CsvAccelerometer, Accelerometer>(
      dataFilepath.accelerometer,
      {
        headers: true,
      }
    ).transform(accelerometerParser);
  }

  public async init() {
    for await (const gps of this.gpsStream) {
      this.gpsData.push(gps);
    }

    for await (const accelerometer of this.accelerometerStream) {
      this.accelerometerData.push(accelerometer);
    }
  }

  _read(): void {
    this.aggregatedDataStreamInterval = setTimeout(() => {
      this.push(this.getAggregatedData());
    }, Math.random() * 1000 + 1000);
  }

  private getAggregatedData() {
    const gps = this.getRandomElement(this.gpsData);
    const accelerometer = this.getRandomElement(this.accelerometerData);
    return {
      gps,
      accelerometer,
      timestamp: new Date(),
    };
  }

  private getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
  }

  _destroy(
    error: Error | null,
    _: (error?: Error | null | undefined) => void
  ): void {
    this.aggregatedDataStreamInterval?.unref();
    this.accelerometerStream.destroy(error || undefined);
    this.gpsStream.destroy(error || undefined);
  }
}
