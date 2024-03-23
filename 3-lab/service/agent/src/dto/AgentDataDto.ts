import { AccelerometerDto } from "./AccelerometerDto";
import { GpsDto } from "./GpsDto";

export interface AgentDataDto {
  accelerometer: AccelerometerDto;
  gps: GpsDto;
  timestamp: string;
}
