import { CsvParserStream, parseFile } from "fast-csv";
import { Readable } from "node:stream";
import { Gps } from "src/domain/Gps";
import { Parking } from "src/domain/Parking";

type CsvGps = Record<keyof Gps, string>;
type CsvParking = Record<keyof Gps | "empty_count", string>;

const gpsParser = (csvGps: CsvGps): Gps => ({
  latitude: Number.parseFloat(csvGps.latitude),
  longitude: Number.parseFloat(csvGps.longitude),
});

const parkingParser = (csvGps: CsvParking): Parking => ({
  emptyCount: Number.parseInt(csvGps.empty_count),
  gps: gpsParser(csvGps),
});

export class ParkingDataSource extends Readable {
  private streamInterval: NodeJS.Timeout | null = null;
  private parkingStream: CsvParserStream<CsvParking, Parking>;
  private streamData = new Array<Parking>();

  constructor(dataFilepath: { parking: string }) {
    super({ objectMode: true });
    this.parkingStream = parseFile<CsvParking, Parking>(dataFilepath.parking, {
      headers: true,
    }).transform(parkingParser);
  }

  public async init() {
    for await (const parking of this.parkingStream) {
      this.streamData.push(parking);
    }
  }

  _read(): void {
    this.streamInterval = setTimeout(() => {
      this.push(this.getData());
    }, Math.random() * 1000 + 1000);
  }

  private getData() {
    return this.streamData[Math.floor(Math.random() * this.streamData.length)];
  }

  _destroy(
    error: Error | null,
    _: (error?: Error | null | undefined) => void
  ): void {
    this.streamInterval?.unref();
    this.parkingStream.destroy(error || undefined);
  }
}
