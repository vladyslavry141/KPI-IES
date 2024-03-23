import { AccelerometerDto } from "./AccelerometerDto";
import { GpsDto } from "./GpsDto";

export interface AggregatedDataDto {
  accelerometer: AccelerometerDto;
  gps: GpsDto;
  timestamp: string;
}
