import { AccelerometerDto } from "./AccelerometerDto";
import { GpsDto } from "./GpsDto";

export interface EdgeDataDto {
  road_state: string;
  accelerometer: AccelerometerDto;
  gps: GpsDto;
  timestamp: string;
}
